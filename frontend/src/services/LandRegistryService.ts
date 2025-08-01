import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { AuthClient } from '@dfinity/auth-client';
import {
  LandParcel,
  TransferRequest,
  UserProfile,
  ApiResult,
  LandRegistryCreateParcelRequest,
  SearchFilters,
  UseLandRegistryState,
} from '../types';

// Interface matching your backend canister methods
export interface LandRegistryActor {
  get_parcel: (token_id: bigint) => Promise<LandParcel | null>;
  get_parcels_by_owner: (owner: Principal) => Promise<LandParcel[]>;
  get_all_parcels: () => Promise<LandParcel[]>;
  search_parcels: (filters: SearchFilters) => Promise<LandParcel[]>;
  get_user_profile: (p...
  new_owner: Principal;
  transfer_fee: bigint;
  documents: string[];
  reason: string;
}

export interface UserProfile {
  principal: Principal;
  name: string;
  role: 'Admin' | 'User';
  registration_date: bigint;
  contact_info: Record<string, string>;
}

// Interface matching your backend canister methods
export interface LandRegistryActor {
  // Query methods
  get_parcel: (id: string) => Promise<LandParcel | null>;
  get_parcels_by_owner: (owner: Principal) => Promise<LandParcel[]>;
  get_all_parcels: () => Promise<LandParcel[]>;
  search_parcels: (filters: Record<string, string>) => Promise<LandParcel[]>;
  get_user_profile: (principal: Principal) => Promise<UserProfile | null>;
  get_transfer_requests: () => Promise<TransferRequest[]>;
  get_pending_transfers: () => Promise<TransferRequest[]>;
  verify_ownership: (parcel_id: string, owner: Principal) => Promise<boolean>;
  
  // Update methods
  register_parcel: (parcel: Omit<LandParcel, 'id' | 'registration_date' | 'last_updated'>) => Promise<{ Ok: string } | { Err: string }>;
  transfer_ownership: (request: TransferRequest) => Promise<{ Ok: string } | { Err: string }>;
  approve_transfer: (parcel_id: string, new_owner: Principal) => Promise<{ Ok: string } | { Err: string }>;
  reject_transfer: (parcel_id: string, reason: string) => Promise<{ Ok: string } | { Err: string }>;
  update_parcel: (id: string, updates: Partial<LandParcel>) => Promise<{ Ok: string } | { Err: string }>;
  create_user_profile: (profile: Omit<UserProfile, 'principal' | 'registration_date'>) => Promise<{ Ok: string } | { Err: string }>;
  update_user_profile: (updates: Partial<UserProfile>) => Promise<{ Ok: string } | { Err: string }>;
}

class LandRegistryService {
  private actor: LandRegistryActor | null = null;
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
      this.actor = Actor.createActor<LandRegistryActor>(this.getIDL(), {
        agent: this.agent,
        canisterId: this.canisterId,
      });

    } catch (error) {
      console.error('Failed to initialize LandRegistryService:', error);
      throw error;
    }
  }

  private getIDL() {
    // This would normally be generated from your .did file
    // For now, we'll use a simplified interface
    return ({ IDL }: any) => {
      const LandParcel = IDL.Record({
        id: IDL.Text,
        owner: IDL.Principal,
        coordinates: IDL.Record({
          latitude: IDL.Float64,
          longitude: IDL.Float64,
        }),
        area: IDL.Float64,
        land_use: IDL.Text,
        zone: IDL.Text,
        survey_number: IDL.Text,
        village: IDL.Text,
        district: IDL.Text,
        state: IDL.Text,
        registration_date: IDL.Int,
        last_updated: IDL.Int,
        documents: IDL.Vec(IDL.Text),
        metadata: IDL.Record({}),
      });

      const TransferRequest = IDL.Record({
        parcel_id: IDL.Text,
        new_owner: IDL.Principal,
        transfer_fee: IDL.Nat,
        documents: IDL.Vec(IDL.Text),
        reason: IDL.Text,
      });

      const UserProfile = IDL.Record({
        principal: IDL.Principal,
        name: IDL.Text,
        role: IDL.Variant({ Admin: IDL.Null, User: IDL.Null }),
        registration_date: IDL.Int,
        contact_info: IDL.Record({}),
      });

      const Result = IDL.Variant({
        Ok: IDL.Text,
        Err: IDL.Text,
      });

      return IDL.Service({
        // Query methods
        get_parcel: IDL.Func([IDL.Text], [IDL.Opt(LandParcel)], ['query']),
        get_parcels_by_owner: IDL.Func([IDL.Principal], [IDL.Vec(LandParcel)], ['query']),
        get_all_parcels: IDL.Func([], [IDL.Vec(LandParcel)], ['query']),
        search_parcels: IDL.Func([IDL.Record({})], [IDL.Vec(LandParcel)], ['query']),
        get_user_profile: IDL.Func([IDL.Principal], [IDL.Opt(UserProfile)], ['query']),
        get_transfer_requests: IDL.Func([], [IDL.Vec(TransferRequest)], ['query']),
        get_pending_transfers: IDL.Func([], [IDL.Vec(TransferRequest)], ['query']),
        verify_ownership: IDL.Func([IDL.Text, IDL.Principal], [IDL.Bool], ['query']),
        
        // Update methods
        register_parcel: IDL.Func([LandParcel], [Result], []),
        transfer_ownership: IDL.Func([TransferRequest], [Result], []),
        approve_transfer: IDL.Func([IDL.Text, IDL.Principal], [Result], []),
        reject_transfer: IDL.Func([IDL.Text, IDL.Text], [Result], []),
        update_parcel: IDL.Func([IDL.Text, LandParcel], [Result], []),
        create_user_profile: IDL.Func([UserProfile], [Result], []),
        update_user_profile: IDL.Func([UserProfile], [Result], []),
      });
    };
  }

  // Parcel management methods
  async getParcel(id: string): Promise<LandParcel | null> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.get_parcel(id);
  }

  async getParcelsByOwner(owner: Principal): Promise<LandParcel[]> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.get_parcels_by_owner(owner);
  }

  async getAllParcels(): Promise<LandParcel[]> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.get_all_parcels();
  }

  async searchParcels(filters: Record<string, string>): Promise<LandParcel[]> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.search_parcels(filters);
  }

  async registerParcel(parcel: Omit<LandParcel, 'id' | 'registration_date' | 'last_updated'>): Promise<{ Ok: string } | { Err: string }> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.register_parcel(parcel);
  }

  async updateParcel(id: string, updates: Partial<LandParcel>): Promise<{ Ok: string } | { Err: string }> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.update_parcel(id, updates);
  }

  // Transfer management methods
  async transferOwnership(request: TransferRequest): Promise<{ Ok: string } | { Err: string }> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.transfer_ownership(request);
  }

  async approveTransfer(parcelId: string, newOwner: Principal): Promise<{ Ok: string } | { Err: string }> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.approve_transfer(parcelId, newOwner);
  }

  async rejectTransfer(parcelId: string, reason: string): Promise<{ Ok: string } | { Err: string }> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.reject_transfer(parcelId, reason);
  }

  async getTransferRequests(): Promise<TransferRequest[]> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.get_transfer_requests();
  }

  async getPendingTransfers(): Promise<TransferRequest[]> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.get_pending_transfers();
  }

  // User management methods
  async getUserProfile(principal: Principal): Promise<UserProfile | null> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.get_user_profile(principal);
  }

  async createUserProfile(profile: Omit<UserProfile, 'principal' | 'registration_date'>): Promise<{ Ok: string } | { Err: string }> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.create_user_profile(profile);
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<{ Ok: string } | { Err: string }> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.update_user_profile(updates);
  }

  // Utility methods
  async verifyOwnership(parcelId: string, owner: Principal): Promise<boolean> {
    if (!this.actor) throw new Error('Service not initialized');
    return await this.actor.verify_ownership(parcelId, owner);
  }

  // Helper method to format area in different units
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

  // Helper method to format dates
  formatDate(timestamp: bigint): string {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  }

  // Helper method to generate parcel display ID
  getParcelDisplayId(parcel: LandParcel): string {
    return `${parcel.state.substring(0, 2).toUpperCase()}-${parcel.district.substring(0, 3).toUpperCase()}-${parcel.survey_number}`;
  }
}

// Export singleton instance
export const landRegistryService = new LandRegistryService();
export default landRegistryService;
