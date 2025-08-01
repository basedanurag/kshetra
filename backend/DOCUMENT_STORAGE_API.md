# Document Storage API for Land Registry

## Overview

This document describes the comprehensive API for registering and fetching document hashes for land deeds, integrating with both IPFS and ICP stable storage backends. The system ensures document hashes are properly referenced in land parcel NFTs and provides tamper-proof storage and retrieval mechanisms.

## Architecture

### Storage Backends

1. **IPFS (InterPlanetary File System)**
   - Decentralized file storage
   - Content-addressed using IPFS CIDs
   - Configurable gateway URLs
   - Optional pinning service integration

2. **ICP Stable Storage**
   - On-chain storage within the Internet Computer
   - Direct file content storage
   - Compression and encryption support
   - Size limits and type restrictions

### Key Components

- **DocumentHash**: Core data structure containing document metadata and storage references
- **DocumentAccessControl**: Permission system for document access
- **DocumentStorageConfiguration**: System-wide configuration for storage backends
- **LandParcel Integration**: Automatic linking of documents to land parcel NFTs

## API Reference

### Document Registration

#### `register_document(request: DocumentRegistrationRequest) -> Result<String, DocumentValidationError>`

Registers a new document in the system with the specified storage backend.

**Parameters:**
- `request`: Document registration request containing:
  - `document_type`: Type of document (LandDeed, SurveyReport, etc.)
  - `title`: Human-readable document title
  - `description`: Optional document description
  - `file_name`: Original filename
  - `file_size`: Size in bytes
  - `mime_type`: MIME type of the document
  - `storage_backend`: IPFS or ICPStableStorage
  - `land_parcel_ids`: Associated land parcels
  - `ipfs_cid`: IPFS Content Identifier (required for IPFS backend)
  - `file_content`: Raw file bytes (required for ICP storage)
  - `tags`: Searchable tags

**Returns:**
- `Ok(String)`: Unique document ID
- `Err(DocumentValidationError)`: Validation error details

**Process Flow:**
1. Validate caller permissions
2. Generate content hash based on storage backend
3. Create unique document ID
4. Store document metadata and hash
5. Link to associated land parcels
6. Return document ID for future reference

### Document Retrieval

#### `fetch_document_by_id(document_id: String) -> Option<DocumentRetrievalResponse>`

Retrieves a document by its unique identifier.

**Parameters:**
- `document_id`: Unique document identifier

**Returns:**
- `Some(DocumentRetrievalResponse)`: Document details with access information
- `None`: Document not found

#### `query_documents(filter: DocumentQueryFilter) -> Vec<DocumentRetrievalResponse>`

Query documents based on multiple filter criteria.

**Filter Options:**
- `document_type`: Filter by document type
- `land_parcel_id`: Documents associated with specific parcel
- `uploaded_by`: Documents uploaded by specific user
- `verification_status`: Filter by verification status
- `created_after`/`created_before`: Date range filters
- `tags`: Must contain all specified tags

### Land Parcel Integration

Documents are automatically linked to land parcels through:

1. **Registration Time Linking**: Associate documents during parcel registration
2. **Post-Registration Linking**: Add documents to existing parcels
3. **NFT Metadata Integration**: Document hashes included in parcel metadata
4. **History Tracking**: Document changes tracked in parcel transaction history

## Document Types

- `LandDeed`: Legal ownership documents
- `SurveyReport`: Land survey and boundary information
- `TitleCertificate`: Official title certificates
- `TaxAssessment`: Property tax assessments
- `ZoningPermit`: Zoning and land use permits
- `EnvironmentalReport`: Environmental impact assessments
- `OwnershipHistory`: Historical ownership records
- `LegalDocument`: Legal proceedings and judgments
- `Photo`: Property photographs and visual documentation
- `Other(String)`: Custom document types

## Security and Access Control

### Access Levels

- `Public`: Accessible to anyone
- `Restricted`: Authorized users only
- `Owner`: Land parcel owner only
- `Administrative`: Admin/registrar access only

### Permission System

Documents inherit access permissions based on:
1. User roles (Admin, LandRegistrar, Auditor, User)
2. Land parcel ownership
3. Explicit access grants
4. Time-based access expiration

## IPFS Integration Process

### Registration Flow

1. **Upload to IPFS**: Client uploads document to IPFS network
2. **Obtain CID**: IPFS returns Content Identifier (CID)
3. **Register Document**: Call `register_document` with IPFS CID
4. **Generate Hash**: System creates document hash entry
5. **Link to Parcels**: Associate with specified land parcels
6. **Store Metadata**: Persist document metadata in stable storage

### Retrieval Flow

1. **Query Document**: Client queries by document ID or filters
2. **Check Permissions**: Verify access rights
3. **Generate Gateway URL**: Create IPFS gateway URL from CID
4. **Return Response**: Include document metadata and access URL

### Configuration

```rust
IPFSConfig {
    gateway_url: "https://gateway.pinata.cloud",
    api_endpoint: "https://api.pinata.cloud",
    pin_service_url: Option<String>,
    pin_service_token: Option<String>,
}
```

## ICP Stable Storage Integration

### Registration Flow

1. **Receive Content**: Client provides raw file bytes
2. **Generate Checksum**: Calculate SHA-256 hash
3. **Validate File**: Check size limits and MIME types
4. **Store Content**: Save to ICP stable storage
5. **Create Hash Entry**: Store document metadata
6. **Link to Parcels**: Associate with land parcels

### Retrieval Flow

1. **Query Document**: Client requests document
2. **Check Permissions**: Verify access rights
3. **Retrieve Content**: Fetch from stable storage
4. **Generate Access Token**: Create temporary access token
5. **Return Response**: Include metadata and access information

### Configuration

```rust
ICPStorageConfig {
    max_file_size: 10 * 1024 * 1024, // 10MB
    allowed_mime_types: vec![
        "application/pdf",
        "image/jpeg",
        "image/png",
        "text/plain",
        "application/json",
    ],
    encryption_enabled: false,
    compression_enabled: true,
}
```

## Error Handling

### Validation Errors

- `InvalidFileType`: Unsupported MIME type
- `FileSizeExceeded`: File exceeds size limits
- `InvalidHash`: Malformed or invalid hash
- `MissingIPFSCID`: IPFS CID required but not provided
- `InvalidLandParcelId`: Referenced parcel doesn't exist
- `UnauthorizedUploader`: User lacks upload permissions
- `DuplicateDocument`: Document already exists
- `InvalidMetadata`: Required metadata missing or invalid

## Best Practices

### For IPFS Integration

1. **Pin Important Documents**: Use pinning services for critical documents
2. **Multiple Gateways**: Configure fallback gateway URLs
3. **CID Validation**: Verify CIDs before registration
4. **Metadata Backup**: Store essential metadata on-chain

### For ICP Storage Integration

1. **Size Optimization**: Compress documents before storage
2. **Type Validation**: Strictly validate MIME types
3. **Access Control**: Implement proper permission checks
4. **Storage Monitoring**: Monitor storage usage and limits

### General Recommendations

1. **Immutable References**: Never modify existing document hashes
2. **Audit Trail**: Maintain complete history of document changes
3. **Backup Strategy**: Implement redundant storage mechanisms
4. **Access Logging**: Log all document access attempts
5. **Regular Verification**: Periodically verify document integrity

## Usage Examples

### Register IPFS Document

```rust
let request = DocumentRegistrationRequest {
    document_type: DocumentType::LandDeed,
    title: "Property Deed - 123 Main St".to_string(),
    description: Some("Official land deed for downtown property".to_string()),
    file_name: "deed_123_main_st.pdf".to_string(),
    file_size: 1024768,
    mime_type: "application/pdf".to_string(),
    storage_backend: StorageBackend::IPFS,
    land_parcel_ids: vec![42],
    ipfs_cid: Some("QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx".to_string()),
    file_content: None,
    tags: vec!["deed".to_string(), "legal".to_string()],
};

let document_id = register_document(request).expect("Failed to register document");
```

### Query Documents by Land Parcel

```rust
let filter = DocumentQueryFilter {
    document_type: None,
    land_parcel_id: Some(42),
    uploaded_by: None,
    verification_status: Some(VerificationStatus::Verified),
    created_after: None,
    created_before: None,
    tags: vec![],
};

let documents = query_documents(filter);
```

### Retrieve Document

```rust
let response = fetch_document_by_id("doc_abc123".to_string());
if let Some(doc_response) = response {
    println!("Document: {}", doc_response.document_hash.metadata.title);
    if let Some(url) = doc_response.content_url {
        println!("Access URL: {}", url);
    }
}
```

## Integration with Land Parcel NFTs

### Automatic Hash Inclusion

When documents are registered and linked to land parcels:

1. Document hashes are automatically added to `LandParcelMetadata.document_hashes`
2. NFT metadata is updated to reflect new documents
3. Transaction history records document additions
4. Certified data is updated for tamper-proof verification

### Metadata Structure

```rust
pub struct LandParcelMetadata {
    pub location: String,
    pub size_sq_meters: f64,
    pub coordinates: Coordinates,
    pub document_hashes: Vec<String>, // Document IDs linked to this parcel
    pub legal_description: Option<String>,
    pub zoning_type: Option<String>,
    pub assessed_value: Option<f64>,
    pub last_updated: u64,
}
```

### Transaction History Integration

Document operations are recorded in the parcel's transaction history:

```rust
TransactionRecord {
    transaction_id: "tx_456789",
    from_owner: Some(current_owner),
    to_owner: current_owner,
    timestamp: ic_cdk::api::time(),
    transaction_type: TransactionType::StatusUpdate,
    document_hash: Some("doc_abc123"), // Reference to document
    notes: Some("Added property deed document"),
}
```

This comprehensive system ensures that all land-related documents are securely stored, easily retrievable, and permanently linked to their corresponding land parcel NFTs, providing a complete and tamper-proof record of land ownership and related documentation.
