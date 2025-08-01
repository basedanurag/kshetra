import { Principal } from '@dfinity/principal';

// Core data structures matching backend types.rs
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LandParcelMetadata {
  location: string;
  size_sq_meters: number;
  coordinates: Coordinates;
  document_hashes: string[];
  legal_description?: string;
  zoning_type?: string;
  assessed_value?: number;
  last_updated: bigint;
}

export enum RegistrationStatus {
  Pending = 'Pending',
  Registered = 'Registered',
  Revoked = 'Revoked'
}

export enum TransactionType {
  Registration = 'Registration',
  Transfer = 'Transfer',
  StatusUpdate = 'StatusUpdate'
}

export interface TransactionRecord {
  transaction_id: string;
  from_owner?: Principal;
  to_owner: Principal;
  timestamp: bigint;
  transaction_type: TransactionType;
  document_hash?: string;
  notes?: string;
}

export interface LandParcel {
  token_id: bigint;
  owner: Principal;
  metadata: LandParcelMetadata;
  status: RegistrationStatus;
  history: TransactionRecord[];
}

export enum UserRole {
  Owner = 'Owner',
  Admin = 'Admin',
  LandRegistrar = 'LandRegistrar',
  Auditor = 'Auditor',
  User = 'User'
}

export interface AuthenticationInfo {
  principal: Principal;
  internet_identity_anchor?: bigint;
  roles: UserRole[];
  created_at: bigint;
  last_login: bigint;
  login_count: bigint;
  is_active: boolean;
}

export interface AuthSession {
  principal: Principal;
  expires_at: bigint;
  created_at: bigint;
  roles: UserRole[];
}

export enum Permission {
  CreateLandParcel = 'CreateLandParcel',
  ApproveLandParcel = 'ApproveLandParcel',
  TransferLandParcel = 'TransferLandParcel',
  ViewLandParcel = 'ViewLandParcel',
  UpdateLandParcel = 'UpdateLandParcel',
  RevokeLandParcel = 'RevokeLandParcel',
  ManageUsers = 'ManageUsers',
  AssignRoles = 'AssignRoles',
  ViewUsers = 'ViewUsers',
  SystemAdmin = 'SystemAdmin',
  ViewAuditLogs = 'ViewAuditLogs',
  ManageCanister = 'ManageCanister'
}

// Document storage types
export enum StorageBackend {
  IPFS = 'IPFS',
  ICPStableStorage = 'ICPStableStorage'
}

export enum DocumentType {
  LandDeed = 'LandDeed',
  SurveyReport = 'SurveyReport',
  TitleCertificate = 'TitleCertificate',
  TaxAssessment = 'TaxAssessment',
  ZoningPermit = 'ZoningPermit',
  EnvironmentalReport = 'EnvironmentalReport',
  OwnershipHistory = 'OwnershipHistory',
  LegalDocument = 'LegalDocument',
  Photo = 'Photo',
  Other = 'Other'
}

export enum VerificationStatus {
  Pending = 'Pending',
  Verified = 'Verified',
  Rejected = 'Rejected',
  Expired = 'Expired'
}

export interface DocumentMetadata {
  document_id: string;
  document_type: DocumentType;
  title: string;
  description?: string;
  file_name: string;
  file_size: bigint;
  mime_type: string;
  created_at: bigint;
  uploaded_by: Principal;
  last_verified?: bigint;
  verification_status: VerificationStatus;
  tags: string[];
}

export interface DocumentHash {
  hash: string;
  storage_backend: StorageBackend;
  metadata: DocumentMetadata;
  land_parcel_ids: bigint[];
  ipfs_cid?: string;
  icp_storage_key?: string;
  checksum: string;
  encryption_key_id?: string;
}

export interface DocumentRegistrationRequest {
  document_type: DocumentType;
  title: string;
  description?: string;
  file_name: string;
  file_size: bigint;
  mime_type: string;
  storage_backend: StorageBackend;
  land_parcel_ids: bigint[];
  ipfs_cid?: string;
  file_content?: Uint8Array;
  tags: string[];
}

export interface DocumentQueryFilter {
  document_type?: DocumentType;
  land_parcel_id?: bigint;
  uploaded_by?: Principal;
  verification_status?: VerificationStatus;
  created_after?: bigint;
  created_before?: bigint;
  tags: string[];
}

export interface DocumentRetrievalResponse {
  document_hash: DocumentHash;
  content_url?: string;
  access_token?: string;
  expiry?: bigint;
}

export enum DocumentValidationError {
  InvalidFileType = 'InvalidFileType',
  FileSizeExceeded = 'FileSizeExceeded',
  InvalidHash = 'InvalidHash',
  MissingIPFSCID = 'MissingIPFSCID',
  InvalidLandParcelId = 'InvalidLandParcelId',
  UnauthorizedUploader = 'UnauthorizedUploader',
  DuplicateDocument = 'DuplicateDocument',
  InvalidMetadata = 'InvalidMetadata'
}

// API Result types
export type ApiResult<T> = { Ok: T } | { Err: string };

// Service interface types
export interface LandRegistryCreateParcelRequest {
  location: string;
  size_sq_meters: number;
  coordinates: Coordinates;
  document_hashes: string[];
}

export interface SearchFilters {
  location?: string;
  owner?: Principal;
  status?: RegistrationStatus;
  min_size?: number;
  max_size?: number;
  zoning_type?: string;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

// DIP721 specific types
export interface DIP721Metadata {
  name: string;
  symbol: string;
  logo?: string;
  total_supply: bigint;
  supported_interfaces: string[];
}

// Transfer types for DIP721
export interface TransferRequest {
  from: Principal;
  to: Principal;
  token_id: bigint;
}

export interface ApprovalRequest {
  approved: Principal;
  token_id: bigint;
}

// Authentication types
export interface AuthStatus {
  isAuthenticated: boolean;
  principal?: Principal;
  roles: UserRole[];
  error?: string;
}

export interface LoginOptions {
  identityProvider?: string;
  maxTimeToLive?: bigint;
  derivationOrigin?: string;
}

// Component props types
export interface ParcelCardProps {
  parcel: LandParcel;
  onSelect?: (parcel: LandParcel) => void;
  onTransfer?: (parcel: LandParcel) => void;
  showActions?: boolean;
}

export interface ParcelFormProps {
  onSubmit: (data: LandRegistryCreateParcelRequest) => Promise<void>;
  isLoading?: boolean;
}

export interface TransferFormProps {
  parcel: LandParcel;
  onSubmit: (request: TransferRequest) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

// Dashboard types
export interface DashboardStats {
  totalParcels: number;
  registeredParcels: number;
  pendingParcels: number;
  totalTransfers: number;
  userCount: number;
}

// Map component types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapProps {
  parcels: LandParcel[];
  selectedParcel?: LandParcel;
  onParcelSelect?: (parcel: LandParcel) => void;
  bounds?: MapBounds;
}

// Error types
export class LandRegistryError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'LandRegistryError';
  }
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredNonNull<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

// Hook types
export interface UseLandRegistryState {
  parcels: LandParcel[];
  loading: boolean;
  error?: string;
  searchFilters: SearchFilters;
  pagination: PaginationState;
}

export interface UseAuthState {
  authStatus: AuthStatus;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  loading: boolean;
}
