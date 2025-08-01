use super::*;
use std::cell::RefCell;
use std::collections::HashMap;

thread_local! {
    pub static LAND_REGISTRY: RefCell<LandRegistryState> = RefCell::new(LandRegistryState::default());
}

#[derive(Clone, Debug)]
pub struct LandRegistryState {
    pub next_token_id: u64,
    pub owner: Principal,
    pub land_parcels: HashMap<u64, LandParcel>,
    pub user_roles: HashMap<Principal, Vec<UserRole>>,
    pub token_approvals: HashMap<u64, Principal>,
}

impl Default for LandRegistryState {
    fn default() -> Self {
        Self {
            next_token_id: 1,
            owner: Principal::anonymous(),
            land_parcels: HashMap::new(),
            user_roles: HashMap::new(),
            token_approvals: HashMap::new(),
        }
    }
}

impl LandRegistryState {
    pub fn get_all_parcels_by_owner(&self, owner: Principal) -> Vec<&LandParcel> {
        self.land_parcels
            .values()
            .filter(|parcel| parcel.owner == owner)
            .collect()
    }
}

// Storage interface functions
pub struct LandRegistry;

impl LandRegistry {
    pub fn set_owner(owner: Principal) {
        LAND_REGISTRY.with(|registry| {
            registry.borrow_mut().owner = owner;
        });
    }

    pub fn get_owner() -> Principal {
        LAND_REGISTRY.with(|registry| registry.borrow().owner)
    }

    pub fn insert_user_roles(principal: Principal, roles: Vec<UserRole>) {
        LAND_REGISTRY.with(|registry| {
            registry.borrow_mut().user_roles.insert(principal, roles);
        });
    }

    pub fn get_user_roles(principal: Principal) -> Vec<UserRole> {
        LAND_REGISTRY.with(|registry| {
            registry.borrow().user_roles.get(&principal).cloned().unwrap_or_default()
        })
    }

    // For now, return empty responses for certified data
    pub fn init_certified_data() {
        // No-op in simplified version
    }

    pub fn get_certified_parcel(token_id: u64) -> Option<(LandParcel, Vec<u8>)> {
        // Simplified: return regular parcel with empty certificate
        LAND_REGISTRY.with(|registry| {
            registry.borrow().land_parcels.get(&token_id).map(|parcel| {
                (parcel.clone(), vec![])
            })
        })
    }

    pub fn get_certified_user_roles(principal: Principal) -> Option<(Vec<UserRole>, Vec<u8>)> {
        // Simplified: return regular roles with empty certificate
        let roles = Self::get_user_roles(principal);
        if roles.is_empty() {
            None
        } else {
            Some((roles, vec![]))
        }
    }

    // Simplified document functions that return errors for now
    pub fn register_document(_request: DocumentRegistrationRequest) -> Result<String, DocumentValidationError> {
        Err(DocumentValidationError::InvalidMetadata)
    }

    pub fn fetch_document_by_id(_document_id: &str) -> Option<DocumentRetrievalResponse> {
        None
    }

    pub fn query_documents(_filter: DocumentQueryFilter) -> Vec<DocumentRetrievalResponse> {
        vec![]
    }
}
