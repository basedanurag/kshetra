import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { AuthClient } from '@dfinity/auth-client';
import {
  LandParcel,
  LandParcelMetadata,
  TransactionRecord,
  Coordinates,
  UserRole,
  RegistrationStatus,
  ApiResult,
  DocumentRegistrationRequest,
  DocumentRetrievalResponse,
  DocumentQueryFilter,
  DocumentValidationError,
} from '../types';

// Backend canister interface matching lib.rs
export interface LandRegistryCanisterActor {
  // DIP721 Interface Methods
  dip721_name: () => Promise<string>;
  dip721_symbol: () => Promise<string>;
  dip721_logo: () => Promise<string | null>;
  dip721_total_supply: () => Promise<bigint>;
  dip721_balance_of: (owner: Principal) => Promise<bigint>;
  dip721_owner_of: (token_id: bigint) => Promise<Principal | null>;
  dip721_token_metadata: (token_id: bigint) => Promise<LandParcelMetadata | null>;
  dip721_supported_interfaces: () => Promise<string[]>;
  dip721_transfer_from: (from: Principal, to: Principal, token_id: bigint) => Promise<ApiResult<null>>;
  dip721_approve: (approved: Principal, token_id: bigint) => Promise<ApiResult<null>>;
  dip721_get_approved: (token_id: bigint) => Promise<Principal | null>;

  // Land Registry Specific Methods
  register_land_parcel: (
    location: string,
    size_sq_meters: number,
    coordinates: Coordinates,
    document_hashes: string[]
  ) => Promise<ApiResult<bigint>>;
  
  approve_registration: (token_id: bigint) => Promise<ApiResult<null>>;
  
  get_land_parcel: (token_id: bigint) => Promise<[LandParcel, Uint8Array] | null>;
  get_land_by_id: (token_id: bigint) => Promise<[LandParcel, Uint8Array] | null>;
  get_lands_by_owner: (owner: Principal) => Promise<LandParcel[]>;
  get_parcels_by_owner: (owner: Principal) => Promise<Array<[LandParcel, Uint8Array]>>;
  get_ownership_history: (token_id: bigint) => Promise<TransactionRecord[] | null>;
  
  // Role Management
  assign_role: (principal: Principal, role: UserRole) => Promise<ApiResult<null>>;
  get_user_roles: (principal: Principal) => Promise<UserRole[]>;
  get_certified_user_roles: (principal: Principal) => Promise<[UserRole[], Uint8Array] | null>;
  
  // Document Management
  register_document: (request: DocumentRegistrationRequest) => Promise<ApiResult<string>>;
  fetch_document_by_id: (document_id: string) => Promise<DocumentRetrievalResponse | null>;
  query_documents: (filter: DocumentQueryFilter) => Promise<DocumentRetrievalResponse[]>;
}

class LandRegistryService {
  private actor: LandRegistryCanisterActor | null = null;
  private agent: HttpAgent | null = null;
  private canisterId: string;

  constructor() {
    this.canisterId = process.env.REACT_APP_LAND_REGISTRY_CANISTER_ID || 'rdmx6-jaaaa-aaaah-qcaiq-cai';
  }

  async init(authClient?: AuthClient): Promise<void> {
    try {
      const host = process.env.REACT_APP_IC_HOST || 'https://ic0.app';
      
      this.agent = new HttpAgent({ host });
      
      // Use authenticated identity if available
      if (authClient) {
        const identity = authClient.getIdentity();
        this.agent = new HttpAgent({ host, identity });
      }

      // Fetch root key for local development
      if (process.env.NODE_ENV === 'development') {
        await this.agent.fetchRootKey();
      }

      // Create actor with the canister interface
      this.actor = Actor.createActor<LandRegistryCanisterActor>(this.getIDL(), {
        agent: this.agent,
        canisterId: this.canisterId,
      });

    } catch (error) {
      console.error('Failed to initialize LandRegistryService:', error);
      throw error;
    }
  }

  private getIDL() {
    return ({ IDL }: any) => {
      // Coordinates type
      const Coordinates = IDL.Record({
        latitude: IDL.Float64,
        longitude: IDL.Float64,
      });

      // Registration Status enum
      const RegistrationStatus = IDL.Variant({
        Pending: IDL.Null,
        Registered: IDL.Null,
        Revoked: IDL.Null,
      });

      // Transaction Type enum
      const TransactionType = IDL.Variant({
        Registration: IDL.Null,
        Transfer: IDL.Null,
        StatusUpdate: IDL.Null,
      });

      // User Role enum
      const UserRole = IDL.Variant({
        Owner: IDL.Null,
        Admin: IDL.Null,
        LandRegistrar: IDL.Null,
        Auditor: IDL.Null,
        User: IDL.Null,
      });

      // Land Parcel Metadata
      const LandParcelMetadata = IDL.Record({
        location: IDL.Text,
        size_sq_meters: IDL.Float64,
        coordinates: Coordinates,
        document_hashes: IDL.Vec(IDL.Text),
        legal_description: IDL.Opt(IDL.Text),
        zoning_type: IDL.Opt(IDL.Text),
        assessed_value: IDL.Opt(IDL.Float64),
        last_updated: IDL.Nat64,
      });

      // Transaction Record
      const TransactionRecord = IDL.Record({
        transaction_id: IDL.Text,
        from_owner: IDL.Opt(IDL.Principal),
        to_owner: IDL.Principal,
        timestamp: IDL.Nat64,
        transaction_type: TransactionType,
        document_hash: IDL.Opt(IDL.Text),
        notes: IDL.Opt(IDL.Text),
      });

      // Land Parcel
      const LandParcel = IDL.Record({
        token_id: IDL.Nat64,
        owner: IDL.Principal,
        metadata: LandParcelMetadata,
        status: RegistrationStatus,
        history: IDL.Vec(TransactionRecord),
      });

      // Document types
      const DocumentType = IDL.Variant({
        LandDeed: IDL.Null,
        SurveyReport: IDL.Null,
        TitleCertificate: IDL.Null,
        TaxAssessment: IDL.Null,
        ZoningPermit: IDL.Null,
        EnvironmentalReport: IDL.Null,
        OwnershipHistory: IDL.Null,
        LegalDocument: IDL.Null,
        Photo: IDL.Null,
        Other: IDL.Text,
      });

      const StorageBackend = IDL.Variant({
        IPFS: IDL.Null,
        ICPStableStorage: IDL.Null,
      });

      const DocumentRegistrationRequest = IDL.Record({
        document_type: DocumentType,
        title: IDL.Text,
        description: IDL.Opt(IDL.Text),
        file_name: IDL.Text,
        file_size: IDL.Nat64,
        mime_type: IDL.Text,
        storage_backend: StorageBackend,
        land_parcel_ids: IDL.Vec(IDL.Nat64),
        ipfs_cid: IDL.Opt(IDL.Text),
        file_content: IDL.Opt(IDL.Vec(IDL.Nat8)),
        tags: IDL.Vec(IDL.Text),
      });

      const DocumentQueryFilter = IDL.Record({
        document_type: IDL.Opt(DocumentType),
        land_parcel_id: IDL.Opt(IDL.Nat64),
        uploaded_by: IDL.Opt(IDL.Principal),
        verification_status: IDL.Opt(IDL.Variant({
          Pending: IDL.Null,
          Verified: IDL.Null,
          Rejected: IDL.Null,
          Expired: IDL.Null,
        })),
        created_after: IDL.Opt(IDL.Nat64),
        created_before: IDL.Opt(IDL.Nat64),
        tags: IDL.Vec(IDL.Text),
      });

      // Result type
      const Result = (okType: any) => IDL.Variant({
        Ok: okType,
        Err: IDL.Text,
      });

      return IDL.Service({
        // DIP721 Interface
        dip721_name: IDL.Func([], [IDL.Text], ['query']),
        dip721_symbol: IDL.Func([], [IDL.Text], ['query']),
        dip721_logo: IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
        dip721_total_supply: IDL.Func([], [IDL.Nat64], ['query']),
        dip721_balance_of: IDL.Func([IDL.Principal], [IDL.Nat64], ['query']),
        dip721_owner_of: IDL.Func([IDL.Nat64], [IDL.Opt(IDL.Principal)], ['query']),
        dip721_token_metadata: IDL.Func([IDL.Nat64], [IDL.Opt(LandParcelMetadata)], ['query']),
        dip721_supported_interfaces: IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
        dip721_transfer_from: IDL.Func([IDL.Principal, IDL.Principal, IDL.Nat64], [Result(IDL.Null)], []),
        dip721_approve: IDL.Func([IDL.Principal, IDL.Nat64], [Result(IDL.Null)], []),
        dip721_get_approved: IDL.Func([IDL.Nat64], [IDL.Opt(IDL.Principal)], ['query']),

        // Land Registry Specific
        register_land_parcel: IDL.Func([IDL.Text, IDL.Float64, Coordinates, IDL.Vec(IDL.Text)], [Result(IDL.Nat64)], []),
        approve_registration: IDL.Func([IDL.Nat64], [Result(IDL.Null)], []),
        get_land_parcel: IDL.Func([IDL.Nat64], [IDL.Opt(IDL.Tuple(LandParcel, IDL.Vec(IDL.Nat8)))], ['query']),
        get_land_by_id: IDL.Func([IDL.Nat64], [IDL.Opt(IDL.Tuple(LandParcel, IDL.Vec(IDL.Nat8)))], ['query']),
        get_lands_by_owner: IDL.Func([IDL.Principal], [IDL.Vec(LandParcel)], ['query']),
        get_parcels_by_owner: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Tuple(LandParcel, IDL.Vec(IDL.Nat8)))], ['query']),
        get_ownership_history: IDL.Func([IDL.Nat64], [IDL.Opt(IDL.Vec(TransactionRecord))], ['query']),

        // Role Management
        assign_role: IDL.Func([IDL.Principal, UserRole], [Result(IDL.Null)], []),
        get_user_roles: IDL.Func([IDL.Principal], [IDL.Vec(UserRole)], ['query']),
        get_certified_user_roles: IDL.Func([IDL.Principal], [IDL.Opt(IDL.Tuple(IDL.Vec(UserRole), IDL.Vec(IDL.Nat8)))], ['query']),

        // Document Management
        register_document: IDL.Func([DocumentRegistrationRequest], [Result(IDL.Text)], []),
        fetch_document_by_id: IDL.Func([IDL.Text], [IDL.Opt(IDL.Record({}))], ['query']), // Simplified for now
        query_documents: IDL.Func([DocumentQueryFilter], [IDL.Vec(IDL.Record({}))], ['query']), // Simplified for now
      });
    };
  }

  // DIP721 NFT Interface Methods
  async getDIP721Name(): Promise<string> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.dip721_name();
  }

  async getDIP721Symbol(): Promise<string> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.dip721_symbol();
  }

  async getDIP721Logo(): Promise<string | null> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.dip721_logo();
  }

  async getTotalSupply(): Promise<bigint> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.dip721_total_supply();
  }

  async getBalanceOf(owner: Principal): Promise<bigint> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.dip721_balance_of(owner);
  }

  async getOwnerOf(tokenId: bigint): Promise<Principal | null> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.dip721_owner_of(tokenId);
  }

  async getTokenMetadata(tokenId: bigint): Promise<LandParcelMetadata | null> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.dip721_token_metadata(tokenId);
  }

  async getSupportedInterfaces(): Promise<string[]> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.dip721_supported_interfaces();
  }

  async transferFrom(from: Principal, to: Principal, tokenId: bigint): Promise<ApiResult<null>> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.dip721_transfer_from(from, to, tokenId);
  }

  async approve(approved: Principal, tokenId: bigint): Promise<ApiResult<null>> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.dip721_approve(approved, tokenId);
  }

  async getApproved(tokenId: bigint): Promise<Principal | null> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.dip721_get_approved(tokenId);
  }

  // Land Registry Specific Methods
  async registerLandParcel(
    location: string,
    sizeSquareMeters: number,
    coordinates: Coordinates,
    documentHashes: string[]
  ): Promise<ApiResult<bigint>> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.register_land_parcel(location, sizeSquareMeters, coordinates, documentHashes);
  }

  async approveRegistration(tokenId: bigint): Promise<ApiResult<null>> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.approve_registration(tokenId);
  }

  async getLandParcel(tokenId: bigint): Promise<[LandParcel, Uint8Array] | null> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.get_land_parcel(tokenId);
  }

  async getLandById(tokenId: bigint): Promise<[LandParcel, Uint8Array] | null> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.get_land_by_id(tokenId);
  }

  async getLandsByOwner(owner: Principal): Promise<LandParcel[]> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.get_lands_by_owner(owner);
  }

  async getParcelsByOwner(owner: Principal): Promise<Array<[LandParcel, Uint8Array]>> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.get_parcels_by_owner(owner);
  }

  async getOwnershipHistory(tokenId: bigint): Promise<TransactionRecord[] | null> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.get_ownership_history(tokenId);
  }

  // Role Management Methods
  async assignRole(principal: Principal, role: UserRole): Promise<ApiResult<null>> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.assign_role(principal, role);
  }

  async getUserRoles(principal: Principal): Promise<UserRole[]> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.get_user_roles(principal);
  }

  async getCertifiedUserRoles(principal: Principal): Promise<[UserRole[], Uint8Array] | null> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.get_certified_user_roles(principal);
  }

  // Document Management Methods
  async registerDocument(request: DocumentRegistrationRequest): Promise<ApiResult<string>> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.register_document(request);
  }

  async fetchDocumentById(documentId: string): Promise<DocumentRetrievalResponse | null> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.fetch_document_by_id(documentId);
  }

  async queryDocuments(filter: DocumentQueryFilter): Promise<DocumentRetrievalResponse[]> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.query_documents(filter);
  }

  // Utility Methods
  formatArea(area: number, unit: 'sqm' | 'acre' | 'hectare' = 'sqm'): string {
    switch (unit) {
      case 'acre':
        return `${(area * 0.000247105).toFixed(2)} acres`;
      case 'hectare':
        return `${(area * 0.0001).toFixed(2)} hectares`;
      default:
        return `${area.toFixed(2)} sq.m`;
    }
  }

  formatDate(timestamp: bigint): string {
    // Convert nanoseconds to milliseconds
    return new Date(Number(timestamp) / 1_000_000).toLocaleDateString();
  }

  formatTimestamp(timestamp: bigint): string {
    return new Date(Number(timestamp) / 1_000_000).toLocaleString();
  }

  getParcelDisplayId(parcel: LandParcel): string {
    const tokenId = Number(parcel.token_id);
    const location = parcel.metadata.location;
    return `LAND-${tokenId.toString().padStart(6, '0')}-${location.substring(0, 3).toUpperCase()}`;
  }

  getStatusColor(status: RegistrationStatus): string {
    switch (status) {
      case RegistrationStatus.Registered:
        return 'green';
      case RegistrationStatus.Pending:
        return 'orange';
      case RegistrationStatus.Revoked:
        return 'red';
      default:
        return 'gray';
    }
  }

  // Helper method to check if a result is successful
  isResultOk<T>(result: ApiResult<T>): result is { Ok: T } {
    return 'Ok' in result;
  }

  // Helper method to extract error message from result
  getErrorMessage<T>(result: ApiResult<T>): string {
    return 'Err' in result ? result.Err : 'Unknown error';
  }

  // Helper method to extract success value from result
  getSuccessValue<T>(result: ApiResult<T>): T | null {
    return 'Ok' in result ? result.Ok : null;
  }
}

// Export singleton instance
export const landRegistryService = new LandRegistryService();
export default landRegistryService;
