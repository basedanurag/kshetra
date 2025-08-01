use super::*;

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct LandParcel {
    pub token_id: u64,
    pub owner: Principal,
    pub metadata: LandParcelMetadata,
    pub status: RegistrationStatus,
    pub history: Vec<TransactionRecord>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct LandParcelMetadata {
    pub location: String,
    pub size_sq_meters: f64,
    pub coordinates: Coordinates,
    pub document_hashes: Vec<String>,
    pub legal_description: Option<String>,
    pub zoning_type: Option<String>,
    pub assessed_value: Option<f64>,
    pub last_updated: u64,
}

#[derive(Clone, Copy, Debug, CandidType, Deserialize, Serialize, PartialEq)]
pub struct Coordinates {
    pub latitude: f64,
    pub longitude: f64,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize, PartialEq, Eq)]
pub enum RegistrationStatus {
    Pending,
    Registered,
    Revoked,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize, PartialEq, Eq)]
pub struct TransactionRecord {
    pub transaction_id: String,
    pub from_owner: Option<Principal>,
    pub to_owner: Principal,
    pub timestamp: u64,
    pub transaction_type: TransactionType,
    pub document_hash: Option<String>,
    pub notes: Option<String>,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize, PartialEq, Eq)]
pub enum TransactionType {
    Registration,
    Transfer,
    StatusUpdate,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize, PartialEq, Eq)]
pub enum UserRole {
    Owner,          // Canister owner - highest privilege level
    Admin,          // System administrator
    LandRegistrar,  // Can register and approve land parcels
    Auditor,        // Can view all data but not modify
    User,           // Basic user - can own land parcels
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct AuthenticationInfo {
    pub principal: Principal,
    pub internet_identity_anchor: Option<u64>,
    pub roles: Vec<UserRole>,
    pub created_at: u64,
    pub last_login: u64,
    pub login_count: u64,
    pub is_active: bool,
}

#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct AuthSession {
    pub principal: Principal,
    pub expires_at: u64,
    pub created_at: u64,
    pub roles: Vec<UserRole>,
}

// Access control permissions
#[derive(Clone, Debug, CandidType, Deserialize, Serialize, PartialEq, Eq)]
pub enum Permission {
    // Land parcel permissions
    CreateLandParcel,
    ApproveLandParcel,
    TransferLandParcel,
    ViewLandParcel,
    UpdateLandParcel,
    RevokeLandParcel,
    
    // User management permissions
    ManageUsers,
    AssignRoles,
    ViewUsers,
    
    // System permissions
    SystemAdmin,
    ViewAuditLogs,
    ManageCanister,
}

// Role to permissions mapping
pub fn get_role_permissions(role: &UserRole) -> Vec<Permission> {
    match role {
        UserRole::Owner => vec![
            Permission::CreateLandParcel,
            Permission::ApproveLandParcel,
            Permission::TransferLandParcel,
            Permission::ViewLandParcel,
            Permission::UpdateLandParcel,
            Permission::RevokeLandParcel,
            Permission::ManageUsers,
            Permission::AssignRoles,
            Permission::ViewUsers,
            Permission::SystemAdmin,
            Permission::ViewAuditLogs,
            Permission::ManageCanister,
        ],
        UserRole::Admin => vec![
            Permission::CreateLandParcel,
            Permission::ApproveLandParcel,
            Permission::TransferLandParcel,
            Permission::ViewLandParcel,
            Permission::UpdateLandParcel,
            Permission::RevokeLandParcel,
            Permission::ManageUsers,
            Permission::AssignRoles,
            Permission::ViewUsers,
            Permission::ViewAuditLogs,
        ],
        UserRole::LandRegistrar => vec![
            Permission::CreateLandParcel,
            Permission::ApproveLandParcel,
            Permission::ViewLandParcel,
            Permission::UpdateLandParcel,
        ],
        UserRole::Auditor => vec![
            Permission::ViewLandParcel,
            Permission::ViewUsers,
            Permission::ViewAuditLogs,
        ],
        UserRole::User => vec![
            Permission::ViewLandParcel,
            Permission::TransferLandParcel, // Only their own parcels
        ],
    }
}
