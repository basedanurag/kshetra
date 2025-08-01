use super::*;
use std::collections::HashMap;
use sha2::{Digest, Sha256};

/// Document storage backends supported by the system
#[derive(Clone, Debug, CandidType, Deserialize, Serialize, PartialEq, Eq)]
pub enum StorageBackend {
    IPFS,
    ICPStableStorage,
}

/// Document types supported by the land registry
#[derive(Clone, Debug, CandidType, Deserialize, Serialize, PartialEq, Eq)]
pub enum DocumentType {
    LandDeed,
    SurveyReport,
    TitleCertificate,
    TaxAssessment,
    ZoningPermit,
    EnvironmentalReport,
    OwnershipHistory,
    LegalDocument,
    Photo,
    Other(String),
}

/// Document metadata structure
#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct DocumentMetadata {
    pub document_id: String,
    pub document_type: DocumentType,
    pub title: String,
    pub description: Option<String>,
    pub file_name: String,
    pub file_size: u64,
    pub mime_type: String,
    pub created_at: u64,
    pub uploaded_by: Principal,
    pub last_verified: Option<u64>,
    pub verification_status: VerificationStatus,
    pub tags: Vec<String>,
}

/// Document verification status
#[derive(Clone, Debug, CandidType, Deserialize, Serialize, PartialEq, Eq)]
pub enum VerificationStatus {
    Pending,
    Verified,
    Rejected,
    Expired,
}

/// Document hash entry containing all relevant information
#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct DocumentHash {
    pub hash: String,
    pub storage_backend: StorageBackend,
    pub metadata: DocumentMetadata,
    pub land_parcel_ids: Vec<u64>, // Associated land parcels
    pub ipfs_cid: Option<String>,  // IPFS Content Identifier
    pub icp_storage_key: Option<String>, // ICP Stable Storage key
    pub checksum: String,          // File integrity checksum
    pub encryption_key_id: Option<String>, // For encrypted documents
}

/// Document registration request
#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct DocumentRegistrationRequest {
    pub document_type: DocumentType,
    pub title: String,
    pub description: Option<String>,
    pub file_name: String,
    pub file_size: u64,
    pub mime_type: String,
    pub storage_backend: StorageBackend,
    pub land_parcel_ids: Vec<u64>,
    pub ipfs_cid: Option<String>,
    pub file_content: Option<Vec<u8>>, // For ICP storage
    pub tags: Vec<String>,
}

/// Document query filters
#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct DocumentQueryFilter {
    pub document_type: Option<DocumentType>,
    pub land_parcel_id: Option<u64>,
    pub uploaded_by: Option<Principal>,
    pub verification_status: Option<VerificationStatus>,
    pub created_after: Option<u64>,
    pub created_before: Option<u64>,
    pub tags: Vec<String>,
}

/// Document retrieval response
#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct DocumentRetrievalResponse {
    pub document_hash: DocumentHash,
    pub content_url: Option<String>, // IPFS gateway URL or ICP endpoint
    pub access_token: Option<String>, // For protected documents
    pub expiry: Option<u64>,         // Access token expiry
}

/// IPFS configuration
#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct IPFSConfig {
    pub gateway_url: String,
    pub api_endpoint: String,
    pub pin_service_url: Option<String>,
    pub pin_service_token: Option<String>,
}

/// ICP Stable Storage configuration
#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct ICPStorageConfig {
    pub max_file_size: u64,
    pub allowed_mime_types: Vec<String>,
    pub encryption_enabled: bool,
    pub compression_enabled: bool,
}

/// Document storage statistics
#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct DocumentStorageStats {
    pub total_documents: u64,
    pub ipfs_documents: u64,
    pub icp_storage_documents: u64,
    pub total_storage_bytes: u64,
    pub verified_documents: u64,
    pub pending_documents: u64,
}

/// Document access permissions
#[derive(Clone, Debug, CandidType, Deserialize, Serialize, PartialEq, Eq)]
pub enum DocumentAccessLevel {
    Public,          // Anyone can access
    Restricted,      // Authorized users only
    Owner,          // Land parcel owner only
    Administrative, // Admin/registrar only
}

/// Document access control entry
#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub struct DocumentAccessControl {
    pub document_hash: String,
    pub access_level: DocumentAccessLevel,
    pub authorized_principals: Vec<Principal>,
    pub authorized_roles: Vec<UserRole>,
    pub expires_at: Option<u64>,
}

impl DocumentHash {
    /// Generate a unique document ID based on content and metadata
    pub fn generate_document_id(content_hash: &str, timestamp: u64, uploader: &Principal) -> String {
        let mut hasher = Sha256::new();
        hasher.update(content_hash.as_bytes());
        hasher.update(timestamp.to_be_bytes());
        hasher.update(uploader.as_slice());
        hex::encode(hasher.finalize())[..16].to_string()
    }

    /// Generate content checksum for integrity verification
    pub fn generate_checksum(content: &[u8]) -> String {
        let mut hasher = Sha256::new();
        hasher.update(content);
        hex::encode(hasher.finalize())
    }

    /// Create IPFS gateway URL
    pub fn get_ipfs_url(&self, gateway_url: &str) -> Option<String> {
        self.ipfs_cid.as_ref().map(|cid| format!("{}/ipfs/{}", gateway_url, cid))
    }

    /// Check if document is associated with a specific land parcel
    pub fn is_associated_with_parcel(&self, parcel_id: u64) -> bool {
        self.land_parcel_ids.contains(&parcel_id)
    }

    /// Add land parcel association
    pub fn add_parcel_association(&mut self, parcel_id: u64) {
        if !self.land_parcel_ids.contains(&parcel_id) {
            self.land_parcel_ids.push(parcel_id);
        }
    }

    /// Remove land parcel association
    pub fn remove_parcel_association(&mut self, parcel_id: u64) {
        self.land_parcel_ids.retain(|&id| id != parcel_id);
    }
}

impl DocumentAccessControl {
    /// Check if a principal has access to the document
    pub fn has_access(&self, principal: &Principal, user_roles: &[UserRole]) -> bool {
        match self.access_level {
            DocumentAccessLevel::Public => true,
            DocumentAccessLevel::Restricted => {
                self.authorized_principals.contains(principal) ||
                user_roles.iter().any(|role| self.authorized_roles.contains(role))
            }
            DocumentAccessLevel::Owner => {
                self.authorized_principals.contains(principal)
            }
            DocumentAccessLevel::Administrative => {
                user_roles.contains(&UserRole::Admin) ||
                user_roles.contains(&UserRole::LandRegistrar) ||
                user_roles.contains(&UserRole::Owner)
            }
        }
    }

    /// Check if access has expired
    pub fn is_expired(&self) -> bool {
        if let Some(expires_at) = self.expires_at {
            ic_cdk::api::time() > expires_at
        } else {
            false
        }
    }
}

/// Document validation errors
#[derive(Clone, Debug, CandidType, Deserialize, Serialize)]
pub enum DocumentValidationError {
    InvalidFileType,
    FileSizeExceeded,
    InvalidHash,
    MissingIPFSCID,
    InvalidLandParcelId,
    UnauthorizedUploader,
    DuplicateDocument,
    InvalidMetadata,
}

impl std::fmt::Display for DocumentValidationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DocumentValidationError::InvalidFileType => write!(f, "Invalid file type"),
            DocumentValidationError::FileSizeExceeded => write!(f, "File size exceeded limit"),
            DocumentValidationError::InvalidHash => write!(f, "Invalid document hash"),
            DocumentValidationError::MissingIPFSCID => write!(f, "Missing IPFS CID for IPFS storage"),
            DocumentValidationError::InvalidLandParcelId => write!(f, "Invalid land parcel ID"),
            DocumentValidationError::UnauthorizedUploader => write!(f, "Unauthorized uploader"),
            DocumentValidationError::DuplicateDocument => write!(f, "Document already exists"),
            DocumentValidationError::InvalidMetadata => write!(f, "Invalid document metadata"),
        }
    }
}
