import { useState, useEffect, useCallback } from 'react';
import { Principal } from '@dfinity/principal';
import { useAuth } from './useAuth';
import landRegistryService, { LandParcel, TransferRequest, UserProfile } from '../services/LandRegistryService';

interface UseLandRegistryReturn {
  // State
  parcels: LandParcel[];
  userParcels: LandParcel[];
  transferRequests: TransferRequest[];
  pendingTransfers: TransferRequest[];
  userProfile: UserProfile | null;
  selectedParcel: LandParcel | null;
  
  // Loading states
  loading: boolean;
  parcelsLoading: boolean;
  transfersLoading: boolean;
  profileLoading: boolean;
  
  // Error states
  error: string | null;
  parcelsError: string | null;
  transfersError: string | null;
  profileError: string | null;
  
  // Actions
  loadAllParcels: () => Promise<void>;
  loadUserParcels: () => Promise<void>;
  loadTransferRequests: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
  searchParcels: (filters: Record<string, string>) => Promise<LandParcel[]>;
  getParcel: (id: string) => Promise<LandParcel | null>;
  registerParcel: (parcel: Omit<LandParcel, 'id' | 'registration_date' | 'last_updated'>) => Promise<boolean>;
  updateParcel: (id: string, updates: Partial<LandParcel>) => Promise<boolean>;
  transferOwnership: (request: TransferRequest) => Promise<boolean>;
  approveTransfer: (parcelId: string, newOwner: Principal) => Promise<boolean>;
  rejectTransfer: (parcelId: string, reason: string) => Promise<boolean>;
  createUserProfile: (profile: Omit<UserProfile, 'principal' | 'registration_date'>) => Promise<boolean>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  selectParcel: (parcel: LandParcel | null) => void;
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useLandRegistry = (): UseLandRegistryReturn => {
  // State
  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [userParcels, setUserParcels] = useState<LandParcel[]>([]);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([]);
  const [pendingTransfers, setPendingTransfers] = useState<TransferRequest[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [parcelsLoading, setParcelsLoading] = useState(false);
  const [transfersLoading, setTransfersLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Error states
  const [error, setError] = useState<string | null>(null);
  const [parcelsError, setParcelsError] = useState<string | null>(null);
  const [transfersError, setTransfersError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const { authClient, principal, isAuthenticated } = useAuth();

  // Initialize service when auth state changes
  useEffect(() => {
    const initializeService = async () => {
      if (authClient) {
        try {
          await landRegistryService.init(authClient);
        } catch (err) {
          console.error('Failed to initialize land registry service:', err);
          setError('Failed to initialize service');
        }
      }
    };

    initializeService();
  }, [authClient]);

  // Load initial data when authenticated
  useEffect(() => {
    if (isAuthenticated && principal) {
      loadUserProfile();
      loadUserParcels();
      if (userProfile?.role === 'Admin') {
        loadAllParcels();
        loadTransferRequests();
      }
    }
  }, [isAuthenticated, principal, userProfile?.role]);

  const handleError = useCallback((err: any, setter: (error: string | null) => void) => {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error('Land Registry Error:', err);
    setter(errorMessage);
    setError(errorMessage);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setParcelsError(null);
    setTransfersError(null);
    setProfileError(null);
  }, []);

  // Load all parcels (admin only)
  const loadAllParcels = useCallback(async () => {
    setParcelsLoading(true);
    setParcelsError(null);
    try {
      const allParcels = await landRegistryService.getAllParcels();
      setParcels(allParcels);
    } catch (err) {
      handleError(err, setParcelsError);
    } finally {
      setParcelsLoading(false);
    }
  }, [handleError]);

  // Load user's parcels
  const loadUserParcels = useCallback(async () => {
    if (!principal) return;
    
    setParcelsLoading(true);
    setParcelsError(null);
    try {
      const userParcelsList = await landRegistryService.getParcelsByOwner(principal);
      setUserParcels(userParcelsList);
    } catch (err) {
      handleError(err, setParcelsError);
    } finally {
      setParcelsLoading(false);
    }
  }, [principal, handleError]);

  // Load transfer requests
  const loadTransferRequests = useCallback(async () => {
    setTransfersLoading(true);
    setTransfersError(null);
    try {
      const [requests, pending] = await Promise.all([
        landRegistryService.getTransferRequests(),
        landRegistryService.getPendingTransfers()
      ]);
      setTransferRequests(requests);
      setPendingTransfers(pending);
    } catch (err) {
      handleError(err, setTransfersError);
    } finally {
      setTransfersLoading(false);
    }
  }, [handleError]);

  // Load user profile
  const loadUserProfile = useCallback(async () => {
    if (!principal) return;
    
    setProfileLoading(true);
    setProfileError(null);
    try {
      const profile = await landRegistryService.getUserProfile(principal);
      setUserProfile(profile);
    } catch (err) {
      handleError(err, setProfileError);
    } finally {
      setProfileLoading(false);
    }
  }, [principal, handleError]);

  // Search parcels
  const searchParcels = useCallback(async (filters: Record<string, string>): Promise<LandParcel[]> => {
    try {
      return await landRegistryService.searchParcels(filters);
    } catch (err) {
      handleError(err, setParcelsError);
      return [];
    }
  }, [handleError]);

  // Get single parcel
  const getParcel = useCallback(async (id: string): Promise<LandParcel | null> => {
    try {
      return await landRegistryService.getParcel(id);
    } catch (err) {
      handleError(err, setParcelsError);
      return null;
    }
  }, [handleError]);

  // Register new parcel
  const registerParcel = useCallback(async (parcel: Omit<LandParcel, 'id' | 'registration_date' | 'last_updated'>): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await landRegistryService.registerParcel(parcel);
      if ('Ok' in result) {
        await loadUserParcels();
        if (userProfile?.role === 'Admin') {
          await loadAllParcels();
        }
        return true;
      } else {
        throw new Error(result.Err);
      }
    } catch (err) {
      handleError(err, setError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadUserParcels, loadAllParcels, userProfile?.role, handleError]);

  // Update parcel
  const updateParcel = useCallback(async (id: string, updates: Partial<LandParcel>): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await landRegistryService.updateParcel(id, updates);
      if ('Ok' in result) {
        await loadUserParcels();
        if (userProfile?.role === 'Admin') {
          await loadAllParcels();
        }
        // Update selected parcel if it's the one being updated
        if (selectedParcel?.id === id) {
          const updatedParcel = await landRegistryService.getParcel(id);
          setSelectedParcel(updatedParcel);
        }
        return true;
      } else {
        throw new Error(result.Err);
      }
    } catch (err) {
      handleError(err, setError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadUserParcels, loadAllParcels, selectedParcel, userProfile?.role, handleError]);

  // Transfer ownership
  const transferOwnership = useCallback(async (request: TransferRequest): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await landRegistryService.transferOwnership(request);
      if ('Ok' in result) {
        await loadTransferRequests();
        await loadUserParcels();
        return true;
      } else {
        throw new Error(result.Err);
      }
    } catch (err) {
      handleError(err, setError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadTransferRequests, loadUserParcels, handleError]);

  // Approve transfer (admin only)
  const approveTransfer = useCallback(async (parcelId: string, newOwner: Principal): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await landRegistryService.approveTransfer(parcelId, newOwner);
      if ('Ok' in result) {
        await loadTransferRequests();
        await loadAllParcels();
        return true;
      } else {
        throw new Error(result.Err);
      }
    } catch (err) {
      handleError(err, setError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadTransferRequests, loadAllParcels, handleError]);

  // Reject transfer (admin only)
  const rejectTransfer = useCallback(async (parcelId: string, reason: string): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await landRegistryService.rejectTransfer(parcelId, reason);
      if ('Ok' in result) {
        await loadTransferRequests();
        return true;
      } else {
        throw new Error(result.Err);
      }
    } catch (err) {
      handleError(err, setError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadTransferRequests, handleError]);

  // Create user profile
  const createUserProfile = useCallback(async (profile: Omit<UserProfile, 'principal' | 'registration_date'>): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await landRegistryService.createUserProfile(profile);
      if ('Ok' in result) {
        await loadUserProfile();
        return true;
      } else {
        throw new Error(result.Err);
      }
    } catch (err) {
      handleError(err, setProfileError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadUserProfile, handleError]);

  // Update user profile
  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await landRegistryService.updateUserProfile(updates);
      if ('Ok' in result) {
        await loadUserProfile();
        return true;
      } else {
        throw new Error(result.Err);
      }
    } catch (err) {
      handleError(err, setProfileError);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadUserProfile, handleError]);

  // Select parcel for detailed view
  const selectParcel = useCallback((parcel: LandParcel | null) => {
    setSelectedParcel(parcel);
  }, []);

  // Refresh all data
  const refresh = useCallback(async () => {
    if (isAuthenticated && principal) {
      await Promise.all([
        loadUserProfile(),
        loadUserParcels(),
        userProfile?.role === 'Admin' ? loadAllParcels() : Promise.resolve(),
        userProfile?.role === 'Admin' ? loadTransferRequests() : Promise.resolve(),
      ]);
    }
  }, [isAuthenticated, principal, userProfile?.role, loadUserProfile, loadUserParcels, loadAllParcels, loadTransferRequests]);

  return {
    // State
    parcels,
    userParcels,
    transferRequests,
    pendingTransfers,
    userProfile,
    selectedParcel,
    
    // Loading states
    loading,
    parcelsLoading,
    transfersLoading,
    profileLoading,
    
    // Error states
    error,
    parcelsError,
    transfersError,
    profileError,
    
    // Actions
    loadAllParcels,
    loadUserParcels,
    loadTransferRequests,
    loadUserProfile,
    searchParcels,
    getParcel,
    registerParcel,
    updateParcel,
    transferOwnership,
    approveTransfer,
    rejectTransfer,
    createUserProfile,
    updateUserProfile,
    selectParcel,
    clearError,
    refresh,
  };
};

export default useLandRegistry;
