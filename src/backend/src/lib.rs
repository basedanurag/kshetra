use candid::{CandidType, Principal};
use ic_cdk::api;
use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Coordinates {
    pub x: u32,
    pub y: u32,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct LandNFT {
    pub id: u64,
    pub name: String,
    pub coordinates: Coordinates,
    pub size: String,
    pub image_data: Vec<u8>,
    pub owner: Principal,
    pub timestamp: u64,
}

// Marketplace-specific structures
#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct Listing {
    pub land_id: u64,        // Reference to land by ID instead of full struct
    pub price: u64,          // Price in some token (e.g., ICP cycles)
    pub seller: Principal,
    pub listed_at: u64,      // Timestamp when listed
}

// Add this explicit Result type definition
#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum ListingResult {
    Ok,
    Err(String),
}

// Storage
thread_local! {
    static LAND_STORAGE: RefCell<Vec<LandNFT>> = RefCell::new(Vec::new());
    static NEXT_ID: RefCell<u64> = RefCell::new(1);
    static MARKETPLACE: RefCell<HashMap<u64, Listing>> = RefCell::new(HashMap::new()); // Marketplace storage
}

#[update]
fn mint_land(
    name: String,
    coordinates: Coordinates,
    size: String,
    image_data: Vec<u8>,
) -> u64 {
    let caller = api::caller();
    let timestamp = api::time();
    
    let id = NEXT_ID.with(|next_id| {
        let mut id_ref = next_id.borrow_mut();
        let current_id = *id_ref;
        *id_ref += 1;
        current_id
    });

    let land = LandNFT {
        id,
        name,
        coordinates,
        size,
        image_data,
        owner: caller,
        timestamp,
    };

    LAND_STORAGE.with(|storage| {
        storage.borrow_mut().push(land);
    });

    id
}

#[query]
fn get_all_land() -> Vec<LandNFT> {
    LAND_STORAGE.with(|storage| storage.borrow().clone())
}

#[query]
fn get_all_listings() -> Vec<Listing> {
    MARKETPLACE.with(|listings| listings.borrow().values().cloned().collect())
}

#[query]
fn get_my_land() -> Vec<LandNFT> {
    let caller = api::caller();
    LAND_STORAGE.with(|storage| {
        storage
            .borrow()
            .iter()
            .filter(|land| land.owner == caller)
            .cloned()
            .collect()
    })
}

// Marketplace functions
#[update]
fn list_land_for_sale(land_id: u64, price: u64) -> ListingResult {
    let caller_id = api::caller();

    LAND_STORAGE.with(|registry| {
        MARKETPLACE.with(|listings| {
            let land_storage = registry.borrow();
            let mut listings_map = listings.borrow_mut();

            // Find land by ID
            let land = match land_storage
                .iter()
                .find(|land| land.id == land_id) {
                Some(land) => land,
                None => return ListingResult::Err("Land not found".to_string()),
            };

            if land.owner != caller_id {
                return ListingResult::Err("Only owner can list this land".to_string());
            }

            // Check if already listed
            if listings_map.contains_key(&land_id) {
                return ListingResult::Err("Land is already listed for sale".to_string());
            }

            let listing = Listing {
                land_id,
                price,
                seller: caller_id,
                listed_at: api::time(),
            };

            listings_map.insert(land_id, listing);
            ListingResult::Ok
        })
    })
}

#[update]
fn remove_listing(land_id: u64) -> ListingResult {
    let caller = api::caller();

    MARKETPLACE.with(|marketplace| {
        let mut listings = marketplace.borrow_mut();
        
        let listing = match listings.get(&land_id) {
            Some(listing) => listing.clone(),
            None => return ListingResult::Err("Listing not found".to_string()),
        };
        
        if listing.seller != caller {
            return ListingResult::Err("Only seller can remove this listing".to_string());
        }

        listings.remove(&land_id);
        ListingResult::Ok
    })
}

#[update]
fn buy_land(land_id: u64) -> ListingResult {
    let buyer = api::caller();

    LAND_STORAGE.with(|registry| {
        MARKETPLACE.with(|listings| {
            let mut land_storage = registry.borrow_mut();
            let mut listings_map = listings.borrow_mut();

            let _listing = match listings_map.get(&land_id) {
                Some(listing) => listing,
                None => return ListingResult::Err("Listing not found".to_string()),
            };
            
            // Find and update land ownership
            let land = match land_storage
                .iter_mut()
                .find(|land| land.id == land_id) {
                Some(land) => land,
                None => return ListingResult::Err("Land not found".to_string()),
            };

            if land.owner == buyer {
                return ListingResult::Err("You already own this land".to_string());
            }

            // Transfer ownership
            land.owner = buyer;

            // Remove listing
            listings_map.remove(&land_id);

            ListingResult::Ok
        })
    })
}

#[query]
fn get_marketplace_listings() -> Vec<(LandNFT, Listing)> {
    MARKETPLACE.with(|marketplace| {
        LAND_STORAGE.with(|storage| {
            let lands = storage.borrow();
            let listings = marketplace.borrow();
            
            listings
                .values()
                .filter_map(|listing| {
                    lands
                        .iter()
                        .find(|land| land.id == listing.land_id)
                        .map(|land| (land.clone(), listing.clone()))
                })
                .collect()
        })
    })
}

#[query]
fn get_listing_by_id(land_id: u64) -> Option<(LandNFT, Listing)> {
    MARKETPLACE.with(|marketplace| {
        LAND_STORAGE.with(|storage| {
            let lands = storage.borrow();
            let listings = marketplace.borrow();
            
            listings.get(&land_id).and_then(|listing| {
                lands
                    .iter()
                    .find(|land| land.id == land_id)
                    .map(|land| (land.clone(), listing.clone()))
            })
        })
    })
}

#[query]
fn get_my_listings() -> Vec<(LandNFT, Listing)> {
    let caller = api::caller();
    
    MARKETPLACE.with(|marketplace| {
        LAND_STORAGE.with(|storage| {
            let lands = storage.borrow();
            let listings = marketplace.borrow();
            
            listings
                .values()
                .filter(|listing| listing.seller == caller)
                .filter_map(|listing| {
                    lands
                        .iter()
                        .find(|land| land.id == listing.land_id)
                        .map(|land| (land.clone(), listing.clone()))
                })
                .collect()
        })
    })
}

