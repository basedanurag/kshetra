import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent, ActorSubclass, Actor } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '../declarations/backend'; // Mock declarations

// Authentication status interface
export interface AuthStatus {
  isAuthenticated: boolean;
  principal?: Principal;
  roles: UserRole[];
  error?: string;
  sessionExpiry?: Date;
}

// User session interface
export interface UserSession {
  principal: Principal;
  roles: UserRole[];
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
}

// Login options interface
export interface LoginOptions {
  identityProvider?: string;
  maxTimeToLive?: bigint;
  derivationOrigin?: string;
  windowOpenerFeatures?: string;
  onSuccess?: () => void;
  onError?: (error?: string) => void;
}

// User roles enum (matching backend - from .did file)
export enum UserRole {
  Admin = 'Admin',
  LandRegistrar = 'LandRegistrar',
  User = 'User' // Default role for authenticated users
}

// Backend actor interface
export interface BackendActor {
  get_user_roles: (principal: Principal) => Promise<UserRole[]>;
  assign_role: (principal: Principal, role: UserRole) => Promise<{ Ok?: null; Err?: string }>;
  get_land_parcel: (tokenId: bigint) => Promise<any>;
  get_parcels_by_owner: (owner: Principal) => Promise<any[]>;
  register_land_parcel: (
    location: string,
    sizeSqMeters: number,
    coordinates: { latitude: number; longitude: number },
    documentHashes: string[]
  ) => Promise<{ Ok?: bigint; Err?: string }>;
}

class AuthService {
  private authClient: AuthClient | null = null;
  private agent: HttpAgent | null = null;
  private actor: ActorSubclass<BackendActor> | null = null;
  private readonly DEFAULT_MAX_TIME_TO_LIVE: bigint = BigInt(8 * 60 * 60 * 1000 * 1000 * 1000); // 8 hours in nanoseconds

  async init(): Promise<void> {
    console.log('🔧 AuthService: Initializing...');
    if (!this.authClient) {
      try {
        this.authClient = await AuthClient.create();
        console.log('✅ AuthService: AuthClient created successfully');
      } catch (error) {
        console.error('❌ AuthService: Failed to create AuthClient:', error);
        throw error;
      }
    } else {
      console.log('🔄 AuthService: AuthClient already exists');
    }
  }

  async login(): Promise<void> {
    console.log('🔑 AuthService: Starting login process...');
    await this.init();
    
    const identityProvider = process.env.REACT_APP_II_URL || 'https://identity.ic0.app';
    console.log('🌐 AuthService: Using identity provider:', identityProvider);
    
    return new Promise((resolve, reject) => {
      this.authClient!.login({
        identityProvider,
        onSuccess: () => {
          console.log('✅ AuthService: Login successful');
          try {
            this.setupAgent();
            console.log('✅ AuthService: Agent setup completed');
            resolve();
          } catch (error) {
            console.error('❌ AuthService: Agent setup failed:', error);
            reject(error);
          }
        },
        onError: (error) => {
          console.error('❌ AuthService: Login failed:', error);
          reject(error);
        },
      });
    });
  }

  async logout(): Promise<void> {
    await this.init();
    await this.authClient!.logout();
    this.agent = null;
    this.actor = null;
  }

  async checkAuth(): Promise<AuthStatus> {
    console.log('🔍 AuthService: Checking authentication status...');
    await this.init();
    
    const isAuthenticated = await this.authClient!.isAuthenticated();
    console.log('🔍 AuthService: Is authenticated:', isAuthenticated);
    
    if (isAuthenticated) {
      const identity = this.authClient!.getIdentity();
      const principal = identity.getPrincipal();
      console.log('👤 AuthService: Principal:', principal.toString());
      
      // Setup agent and actor if not already done
      if (!this.agent) {
        console.log('🔧 AuthService: Setting up agent...');
        this.setupAgent();
      } else {
        console.log('🔄 AuthService: Agent already exists');
      }
      
      // Get user roles from backend
      let roles: string[] = [];
      try {
        if (this.actor) {
          console.log('🎭 AuthService: Fetching user roles from backend...');
          roles = await this.actor.get_user_roles(principal);
          console.log('✅ AuthService: User roles fetched:', roles);
        } else {
          console.warn('⚠️ AuthService: No actor available, cannot fetch roles');
          roles = ['User']; // Default role
        }
      } catch (error) {
        console.error('❌ AuthService: Failed to fetch user roles:', error);
        console.error('❌ AuthService: Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        roles = ['User']; // Default role
      }
      
      const authStatus = {
        isAuthenticated: true,
        principal,
        roles: roles.map(role => role.toString()),
      };
      console.log('✅ AuthService: Final auth status:', authStatus);
      return authStatus;
    }
    
    console.log('❌ AuthService: User not authenticated');
    return {
      isAuthenticated: false,
      roles: [],
    };
  }

  private setupAgent(): void {
    console.log('🔧 AuthService: Setting up HTTP agent...');
    const identity = this.authClient!.getIdentity();
    
    const host = process.env.REACT_APP_IC_HOST || 'https://ic0.app';
    console.log('🌐 AuthService: Using host:', host);
    console.log('🌍 AuthService: Environment:', process.env.NODE_ENV);
    
    this.agent = new HttpAgent({
      identity,
      host
    });
    console.log('✅ AuthService: HTTP Agent created');

    // Only fetch root key in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 AuthService: Fetching root key for development...');
      this.agent.fetchRootKey().then(() => {
        console.log('✅ AuthService: Root key fetched successfully');
      }).catch(err => {
        console.warn('⚠️ AuthService: Unable to fetch root key. Check to ensure that your local replica is running');
        console.error('❌ AuthService: Root key fetch error:', err);
      });
    }

    // Create actor for backend canister
    const canisterId = process.env.REACT_APP_BACKEND_CANISTER_ID;
    console.log('🎯 AuthService: Backend canister ID:', canisterId || 'NOT SET');
    
    if (!canisterId) {
      console.error('❌ AuthService: REACT_APP_BACKEND_CANISTER_ID not set in environment');
      console.log('📋 AuthService: Available environment variables:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP')));
      return;
    }
    
    try {
      // Import declarations check
      console.log('📦 AuthService: Attempting to create actor...');
      
      // Create actor with mock declarations (replace with real ones when available)
      this.actor = Actor.createActor(idlFactory, {
        agent: this.agent,
        canisterId,
      }) as ActorSubclass<BackendActor>;
      
      console.log('✅ AuthService: Actor created successfully');
    } catch (error) {
      console.error('❌ AuthService: Failed to create actor:', error);
      console.error('❌ AuthService: Actor creation error details:', error);
    }
  }

  getAgent(): HttpAgent | null {
    return this.agent;
  }

  getActor(): any {
    return this.actor;
  }

  getPrincipal(): Principal | null {
    if (this.authClient) {
      const identity = this.authClient.getIdentity();
      return identity.getPrincipal();
    }
    return null;
  }
}

const authService = new AuthService();
export default authService;
