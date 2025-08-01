# Kshetra Land Registry - Data Models and DIP721 Interface

This document outlines the data structures and DIP721 NFT interface implementation for the Kshetra Land Registry system.

## Data Models

### 1. Land Parcel Structure

The `LandParcel` struct represents a land parcel as an NFT with comprehensive metadata:

```rust
pub struct LandParcel {
    pub token_id: u64,
    pub owner: Principal,
    pub metadata: LandParcelMetadata,
    pub status: RegistrationStatus,
    pub history: Vec<TransactionRecord>,
}
```

### 2. Land Parcel Metadata

The `LandParcelMetadata` struct contains all relevant information about the land parcel:

```rust
pub struct LandParcelMetadata {
    pub location: String,              // Human-readable address/description
    pub size_sq_meters: f64,           // Size in square meters
    pub coordinates: Coordinates,       // GPS coordinates
    pub document_hashes: Vec<String>,   // IPFS/document hashes for legal docs
    pub legal_description: Option<String>, // Legal land description
    pub zoning_type: Option<String>,    // Zoning classification
    pub assessed_value: Option<f64>,    // Government assessed value
    pub last_updated: u64,             // Timestamp of last update
}
```

### 3. Coordinates

GPS coordinates for precise land parcel location:

```rust
pub struct Coordinates {
    pub latitude: f64,
    pub longitude: f64,
}
```

### 4. Registration Status

Enum representing the current state of land parcel registration:

```rust
pub enum RegistrationStatus {
    Pending,    // Awaiting approval
    Registered, // Fully registered and transferable
    Revoked,    // Registration revoked
}
```

### 5. Transaction Record

Complete transaction history for each land parcel:

```rust
pub struct TransactionRecord {
    pub transaction_id: String,
    pub from_owner: Option<Principal>,  // None for initial registration
    pub to_owner: Principal,
    pub timestamp: u64,
    pub transaction_type: TransactionType,
    pub document_hash: Option<String>,  // Associated legal document
    pub notes: Option<String>,          // Additional context
}
```

### 6. Transaction Type

Types of transactions that can occur:

```rust
pub enum TransactionType {
    Registration,  // Initial land registration
    Transfer,      // Ownership transfer
    StatusUpdate,  // Status change (approval, revocation)
}
```

### 7. User Roles

Role-based access control for system operations:

```rust
pub enum UserRole {
    Admin,         // Full system administration
    LandRegistrar, // Can register and approve land parcels
}
```

## DIP721 Interface Implementation

The system implements the DIP721 NFT standard with the following extensions:

### Standard DIP721 Methods

- `dip721_name()` - Returns "Kshetra Land Registry"
- `dip721_symbol()` - Returns "LAND"
- `dip721_logo()` - Returns logo URL
- `dip721_total_supply()` - Total number of registered land parcels
- `dip721_balance_of(owner)` - Number of parcels owned by a principal
- `dip721_owner_of(token_id)` - Owner of a specific parcel
- `dip721_token_metadata(token_id)` - Full metadata for a parcel
- `dip721_supported_interfaces()` - Supported interface list
- `dip721_transfer_from(from, to, token_id)` - Transfer ownership
- `dip721_approve(approved, token_id)` - Approve transfer
- `dip721_get_approved(token_id)` - Get approved principal

### Land Registry Extensions

#### Registration Functions
- `register_land_parcel()` - Register a new land parcel (requires LandRegistrar role)
- `approve_registration()` - Approve pending registration (requires LandRegistrar role)

#### Query Functions
- `get_land_parcel(token_id)` - Get complete land parcel information
- `get_parcels_by_owner(owner)` - Get all parcels owned by a principal

#### Role Management
- `assign_role(principal, role)` - Assign roles (requires Admin role)
- `get_user_roles(principal)` - Get roles for a principal

## Key Features

### 1. Enhanced Metadata
The DIP721 metadata is extended to include land-specific information:
- Precise GPS coordinates
- Legal document hashes (IPFS integration ready)
- Zoning information
- Government assessed values
- Legal descriptions

### 2. Transaction History
Complete immutable history of all transactions:
- Registration events
- Ownership transfers
- Status changes
- Associated legal documents

### 3. Role-Based Access Control
- **Admin**: Full system control, role assignment
- **LandRegistrar**: Register and approve land parcels

### 4. Registration Workflow
1. LandRegistrar creates a new parcel (status: Pending)
2. LandRegistrar approves the registration (status: Registered)
3. Only registered parcels can be transferred as NFTs

### 5. Transfer Restrictions
- Only registered parcels can be transferred
- Standard DIP721 approval mechanism
- Automatic transaction history recording

## Storage Architecture

The system uses Internet Computer thread-local storage:

```rust
pub struct LandRegistry {
    pub next_token_id: u64,
    pub owner: Principal,
    pub land_parcels: HashMap<u64, LandParcel>,
    pub user_roles: HashMap<Principal, Vec<UserRole>>,
    pub token_approvals: HashMap<u64, Principal>,
}
```

## Security Features

1. **Role-based authorization** for sensitive operations
2. **Transfer restrictions** based on registration status
3. **Immutable transaction history**
4. **Document integrity** through cryptographic hashes
5. **Approval mechanism** for transfers

## Future Extensions

The architecture supports future enhancements:
- Multi-signature transfers for high-value parcels
- Integration with government land registries
- Automated valuation updates
- Fractional ownership through sub-NFTs
- Legal document storage via IPFS
- Smart contract integration for automated transfers

This implementation provides a robust foundation for a decentralized land registry system while maintaining compatibility with the DIP721 NFT standard.

NOTE for FrontEnd devs 
// tell me if you need anything
