use candid::{CandidType, Deserialize, Principal};
use ic_cdk_macros::*;
use serde::Serialize;

pub mod types;
pub mod dip721;
pub mod storage;
pub mod document_storage;

pub use types::*;
pub use dip721::*;
pub use storage::*;
pub use document_storage::*;

// Initialize the canister
#[init]
fn init() {
    let caller = ic_cdk::api::caller();
    
    // Set owner and initial metadata
    LandRegistry::set_owner(caller);
    
    // Assign Admin role to the deployer
    LandRegistry::insert_user_roles(caller, vec![UserRole::Admin]);
    
    // Initialize certified data
    LandRegistry::init_certified_data();
}

// API for Document Hash Management
#[update]
fn register_document(request: DocumentRegistrationRequest) -> Result<String, DocumentValidationError> {
    LandRegistry::register_document(request)
}

#[query]
fn fetch_document_by_id(document_id: String) -> Option<DocumentRetrievalResponse> {
    LandRegistry::fetch_document_by_id(&document_id)
}

#[query]
fn query_documents(filter: DocumentQueryFilter) -> Vec<DocumentRetrievalResponse> {
    LandRegistry::query_documents(filter)
}

// DIP721 Interface Implementation
#[query]
fn dip721_name() -> String {
    "Kshetra Land Registry".to_string()
}

#[query]
fn dip721_symbol() -> String {
    "LAND".to_string()
}

#[query]
fn dip721_logo() -> Option<String> {
    Some("https://kshetra-land-registry.com/logo.png".to_string())
}

#[query]
fn dip721_total_supply() -> u64 {
    LAND_REGISTRY.with(|registry| {
        let registry = registry.borrow();
        registry.land_parcels.len() as u64
    })
}

#[query]
fn get_land_by_id(token_id: u64) -> Option<(LandParcel, Vec<u8>)> {
    LandRegistry::get_certified_parcel(token_id)
}

#[query]
fn get_lands_by_owner(owner: Principal) -> Vec<LandParcel> {
    LAND_REGISTRY.with(|registry| {
        registry.borrow().get_all_parcels_by_owner(owner).into_iter().cloned().collect()
    })
}

#[query]
fn get_ownership_history(token_id: u64) -> Option<Vec<TransactionRecord>> {
    LAND_REGISTRY.with(|registry| {
        let registry = registry.borrow();
        registry.land_parcels.get(&token_id).map(|parcel| parcel.history.clone())
    })
}

#[query]
fn dip721_balance_of(owner: Principal) -> u64 {
    LAND_REGISTRY.with(|registry| {
        let registry = registry.borrow();
        registry.land_parcels
            .values()
            .filter(|parcel| parcel.owner == owner)
            .count() as u64
    })
}

#[query]
fn dip721_owner_of(token_id: u64) -> Option<Principal> {
    LAND_REGISTRY.with(|registry| {
        let registry = registry.borrow();
        registry.land_parcels.get(&token_id).map(|parcel| parcel.owner)
    })
}

#[query]
fn dip721_token_metadata(token_id: u64) -> Option<LandParcelMetadata> {
    LAND_REGISTRY.with(|registry| {
        let registry = registry.borrow();
        registry.land_parcels.get(&token_id).map(|parcel| parcel.metadata.clone())
    })
}

#[query]
fn dip721_supported_interfaces() -> Vec<String> {
    vec![
        "DIP721".to_string(),
        "LandRegistry".to_string(),
        "TransactionHistory".to_string(),
    ]
}

#[update]
fn dip721_transfer_from(from: Principal, to: Principal, token_id: u64) -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    
    LAND_REGISTRY.with(|registry| {
        let mut registry = registry.borrow_mut();
        
        // Check if token exists and get owner
        let current_owner = registry.land_parcels.get(&token_id)
            .ok_or("Token does not exist")?
            .owner;
        
        if current_owner != from {
            return Err("From address is not the owner".to_string());
        }
        
        // Check authorization
        let is_approved = registry.token_approvals.get(&token_id)
            .map_or(false, |approved| approved == &caller);
        
        if caller != from && !is_approved {
            return Err("Caller is not authorized".to_string());
        }
        
        // Check if parcel is registered
        let parcel_status = registry.land_parcels.get(&token_id).unwrap().status.clone();
        if parcel_status != RegistrationStatus::Registered {
            return Err("Land parcel is not in transferable state".to_string());
        }
        
        // Now we can safely get mutable reference
        let parcel = registry.land_parcels.get_mut(&token_id).unwrap();
        
        // Update ownership
        parcel.owner = to;
        
        // Add to history
        let transaction = TransactionRecord {
            transaction_id: generate_transaction_id(),
            from_owner: Some(from),
            to_owner: to,
            timestamp: ic_cdk::api::time(),
            transaction_type: TransactionType::Transfer,
            document_hash: None,
            notes: Some("NFT Transfer".to_string()),
        };
        
        parcel.history.push(transaction);
        
        // Clear approval
        registry.token_approvals.remove(&token_id);
        
        Ok(())
    })
}

#[update]
fn dip721_approve(approved: Principal, token_id: u64) -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    
    LAND_REGISTRY.with(|registry| {
        let mut registry = registry.borrow_mut();
        
        let parcel = registry.land_parcels.get(&token_id)
            .ok_or("Token does not exist")?;
        
        if parcel.owner != caller {
            return Err("Caller is not the owner".to_string());
        }
        
        registry.token_approvals.insert(token_id, approved);
        Ok(())
    })
}

#[query]
fn dip721_get_approved(token_id: u64) -> Option<Principal> {
    LAND_REGISTRY.with(|registry| {
        let registry = registry.borrow();
        registry.token_approvals.get(&token_id).copied()
    })
}

// Land Registry Specific Functions
#[update]
fn register_land_parcel(
    location: String,
    size_sq_meters: f64,
    coordinates: Coordinates,
    document_hashes: Vec<String>,
) -> Result<u64, String> {
    let caller = ic_cdk::api::caller();
    
    if !has_role(&caller, &UserRole::LandRegistrar) && !has_role(&caller, &UserRole::Admin) {
        return Err("Unauthorized: Only land registrars can register parcels".to_string());
    }
    
    LAND_REGISTRY.with(|registry| {
        let mut registry = registry.borrow_mut();
        let token_id = registry.next_token_id;
        registry.next_token_id += 1;
        
        let parcel = LandParcel {
            token_id,
            owner: caller,
            metadata: LandParcelMetadata {
                location: location.clone(),
                size_sq_meters,
                coordinates: coordinates.clone(),
                document_hashes: document_hashes.clone(),
                legal_description: None,
                zoning_type: None,
                assessed_value: None,
                last_updated: ic_cdk::api::time(),
            },
            status: RegistrationStatus::Pending,
            history: vec![TransactionRecord {
                transaction_id: generate_transaction_id(),
                from_owner: None,
                to_owner: caller,
                timestamp: ic_cdk::api::time(),
                transaction_type: TransactionType::Registration,
                document_hash: document_hashes.first().cloned(),
                notes: Some(format!("Initial registration at {}", location)),
            }],
        };
        
        registry.land_parcels.insert(token_id, parcel);
        Ok(token_id)
    })
}

#[update]
fn approve_registration(token_id: u64) -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    
    if !has_role(&caller, &UserRole::LandRegistrar) && !has_role(&caller, &UserRole::Admin) {
        return Err("Unauthorized: Only land registrars can approve registrations".to_string());
    }
    
    LAND_REGISTRY.with(|registry| {
        let mut registry = registry.borrow_mut();
        
        let parcel = registry.land_parcels.get_mut(&token_id)
            .ok_or("Land parcel not found")?;
        
        if parcel.status != RegistrationStatus::Pending {
            return Err("Land parcel is not in pending state".to_string());
        }
        
        parcel.status = RegistrationStatus::Registered;
        
        let transaction = TransactionRecord {
            transaction_id: generate_transaction_id(),
            from_owner: Some(parcel.owner),
            to_owner: parcel.owner,
            timestamp: ic_cdk::api::time(),
            transaction_type: TransactionType::StatusUpdate,
            document_hash: None,
            notes: Some("Registration approved".to_string()),
        };
        
        parcel.history.push(transaction);
        Ok(())
    })
}

#[query]
fn get_land_parcel(token_id: u64) -> Option<(LandParcel, Vec<u8>)> {
    LandRegistry::get_certified_parcel(token_id)
}

#[query]
fn get_parcels_by_owner(owner: Principal) -> Vec<(LandParcel, Vec<u8>)> {
    LAND_REGISTRY.with(|registry| {
        registry.borrow().get_all_parcels_by_owner(owner).iter().map(|parcel| {
            let (parcel, cert) = LandRegistry::get_certified_parcel(parcel.token_id).unwrap();
            (parcel, cert)
        }).collect()
    })
}

#[query]
fn get_certified_user_roles(principal: Principal) -> Option<(Vec<UserRole>, Vec<u8>)> {
    LandRegistry::get_certified_user_roles(principal)
}

// Role Management Functions
#[update]
fn assign_role(principal: Principal, role: UserRole) -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    
    if !has_role(&caller, &UserRole::Admin) {
        return Err("Unauthorized: Only admins can assign roles".to_string());
    }
    
    LAND_REGISTRY.with(|registry| {
        let mut registry = registry.borrow_mut();
        registry.user_roles.entry(principal).or_insert_with(Vec::new).push(role);
        Ok(())
    })
}

#[query]
fn get_user_roles(principal: Principal) -> Vec<UserRole> {
    LAND_REGISTRY.with(|registry| {
        let registry = registry.borrow();
        registry.user_roles.get(&principal).cloned().unwrap_or_default()
    })
}

// Helper Functions
fn has_role(principal: &Principal, role: &UserRole) -> bool {
    LAND_REGISTRY.with(|registry| {
        let registry = registry.borrow();
        registry.user_roles
            .get(principal)
            .map_or(false, |roles| roles.contains(role))
    })
}

fn generate_transaction_id() -> String {
    use sha2::{Digest, Sha256};
    let mut hasher = Sha256::new();
    hasher.update(ic_cdk::api::time().to_be_bytes());
    hasher.update(ic_cdk::api::caller().as_slice());
    hex::encode(hasher.finalize())[..16].to_string()
}

fn authenticate_user(caller: &Principal) -> Result<AuthSession, String> {
    let roles = get_user_roles(*caller);
    Ok(AuthSession {
        principal: *caller,
        expires_at: ic_cdk::api::time() + 24 * 60 * 60_000_000, // 24 hours
        created_at: ic_cdk::api::time(),
        roles,
    })
}

fn check_permission(principal: &Principal, permission: &Permission) -> Result<(), String> {
    let user_roles = get_user_roles(*principal);
    for role in &user_roles {
        let role_permissions = get_role_permissions(role);
        if role_permissions.contains(permission) {
            return Ok(());
        }
    }
    Err("Insufficient permissions".to_string())
}

// Export candid interface
ic_cdk::export_candid!();
