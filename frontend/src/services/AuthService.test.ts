import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import AuthService, { AuthStatus } from './AuthService';

// Mock the DFINITY modules
jest.mock('@dfinity/auth-client');
jest.mock('@dfinity/agent');
jest.mock('@dfinity/principal');

const MockedAuthClient = AuthClient as jest.MockedClass<typeof AuthClient>;
const MockedHttpAgent = HttpAgent as jest.MockedClass<typeof HttpAgent>;

describe('AuthService', () => {
  let mockAuthClient: jest.Mocked<AuthClient>;
  let mockAgent: jest.Mocked<HttpAgent>;
  let mockIdentity: any;
  let mockPrincipal: jest.Mocked<Principal>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create mock instances
    mockPrincipal = {
      toString: jest.fn().mockReturnValue('test-principal-id'),
      toText: jest.fn().mockReturnValue('test-principal-text'),
    } as any;

    mockIdentity = {
      getPrincipal: jest.fn().mockReturnValue(mockPrincipal),
    };

    mockAuthClient = {
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: jest.fn(),
      getIdentity: jest.fn().mockReturnValue(mockIdentity),
    } as any;

    mockAgent = {
      fetchRootKey: jest.fn().mockResolvedValue(undefined),
    } as any;

    // Mock the create methods
    MockedAuthClient.create = jest.fn().mockResolvedValue(mockAuthClient);
    MockedHttpAgent.mockImplementation(() => mockAgent);

    // Set environment variables for testing
    process.env.NODE_ENV = 'test';
    process.env.REACT_APP_II_URL = 'https://identity.ic0.app';
    process.env.REACT_APP_IC_HOST = 'https://ic0.app';
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.REACT_APP_II_URL;
    delete process.env.REACT_APP_IC_HOST;
  });

  describe('Initialization', () => {
    it('should initialize AuthClient when init() is called', async () => {
      const authService = new (AuthService as any).constructor();
      
      await authService.init();
      
      expect(MockedAuthClient.create).toHaveBeenCalledTimes(1);
    });

    it('should not create multiple AuthClient instances', async () => {
      const authService = new (AuthService as any).constructor();
      
      await authService.init();
      await authService.init();
      
      expect(MockedAuthClient.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('Login Flow', () => {
    it('should successfully login with valid credentials', async () => {
      const authService = new (AuthService as any).constructor();
      
      // Mock successful login
      mockAuthClient.login.mockImplementation((options: any) => {
        setTimeout(() => options.onSuccess(), 0);
      });

      const loginPromise = authService.login();
      
      expect(mockAuthClient.login).toHaveBeenCalledWith({
        identityProvider: 'https://identity.ic0.app',
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      });

      await expect(loginPromise).resolves.toBeUndefined();
    });

    it('should handle login failure', async () => {
      const authService = new (AuthService as any).constructor();
      const loginError = new Error('Login failed');
      
      // Mock failed login
      mockAuthClient.login.mockImplementation((options: any) => {
        setTimeout(() => options.onError(loginError), 0);
      });

      const loginPromise = authService.login();
      
      await expect(loginPromise).rejects.toThrow('Login failed');
    });

    it('should use custom identity provider if provided in environment', async () => {
      process.env.REACT_APP_II_URL = 'https://custom-identity.com';
      const authService = new (AuthService as any).constructor();
      
      mockAuthClient.login.mockImplementation((options: any) => {
        setTimeout(() => options.onSuccess(), 0);
      });

      await authService.login();
      
      expect(mockAuthClient.login).toHaveBeenCalledWith({
        identityProvider: 'https://custom-identity.com',
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      });
    });
  });

  describe('Logout Flow', () => {
    it('should successfully logout', async () => {
      const authService = new (AuthService as any).constructor();
      mockAuthClient.logout.mockResolvedValue(undefined);
      
      await authService.logout();
      
      expect(mockAuthClient.logout).toHaveBeenCalledTimes(1);
    });

    it('should clear agent and actor on logout', async () => {
      const authService = new (AuthService as any).constructor();
      mockAuthClient.logout.mockResolvedValue(undefined);
      
      await authService.logout();
      
      expect(authService.getAgent()).toBeNull();
      expect(authService.getActor()).toBeNull();
    });
  });

  describe('Authentication Status Check', () => {
    it('should return authenticated status for valid user', async () => {
      const authService = new (AuthService as any).constructor();
      mockAuthClient.isAuthenticated.mockResolvedValue(true);
      
      const status: AuthStatus = await authService.checkAuth();
      
      expect(status.isAuthenticated).toBe(true);
      expect(status.principal).toBe(mockPrincipal);
      expect(status.roles).toEqual(['User']); // Default role when no backend actor
    });

    it('should return unauthenticated status for invalid user', async () => {
      const authService = new (AuthService as any).constructor();
      mockAuthClient.isAuthenticated.mockResolvedValue(false);
      
      const status: AuthStatus = await authService.checkAuth();
      
      expect(status.isAuthenticated).toBe(false);
      expect(status.principal).toBeUndefined();
      expect(status.roles).toEqual([]);
    });

    it('should handle backend actor role fetching', async () => {
      const authService = new (AuthService as any).constructor();
      mockAuthClient.isAuthenticated.mockResolvedValue(true);
      
      // Mock actor with roles
      const mockActor = {
        get_user_roles: jest.fn().mockResolvedValue(['Admin', 'Moderator']),
      };
      
      // Set the actor on the service
      authService.actor = mockActor;
      
      const status: AuthStatus = await authService.checkAuth();
      
      expect(status.isAuthenticated).toBe(true);
      expect(status.roles).toEqual(['Admin', 'Moderator']);
      expect(mockActor.get_user_roles).toHaveBeenCalledWith(mockPrincipal);
    });

    it('should handle backend role fetching errors gracefully', async () => {
      const authService = new (AuthService as any).constructor();
      mockAuthClient.isAuthenticated.mockResolvedValue(true);
      
      // Mock actor that throws error
      const mockActor = {
        get_user_roles: jest.fn().mockRejectedValue(new Error('Backend error')),
      };
      
      authService.actor = mockActor;
      
      const status: AuthStatus = await authService.checkAuth();
      
      expect(status.isAuthenticated).toBe(true);
      expect(status.roles).toEqual(['User']); // Fallback to default role
    });
  });

  describe('Principal Management', () => {
    it('should return principal when authenticated', () => {
      const authService = new (AuthService as any).constructor();
      authService.authClient = mockAuthClient;
      
      const principal = authService.getPrincipal();
      
      expect(principal).toBe(mockPrincipal);
      expect(mockAuthClient.getIdentity).toHaveBeenCalledTimes(1);
    });

    it('should return null when not initialized', () => {
      const authService = new (AuthService as any).constructor();
      
      const principal = authService.getPrincipal();
      
      expect(principal).toBeNull();
    });
  });

  describe('Agent Setup', () => {
    it('should create HttpAgent with correct configuration', async () => {
      const authService = new (AuthService as any).constructor();
      
      mockAuthClient.login.mockImplementation((options: any) => {
        setTimeout(() => options.onSuccess(), 0);
      });

      await authService.login();
      
      expect(MockedHttpAgent).toHaveBeenCalledWith({
        identity: mockIdentity,
        host: 'https://ic0.app',
      });
    });

    it('should use custom IC host if provided in environment', async () => {
      process.env.REACT_APP_IC_HOST = 'https://custom-ic-host.com';
      const authService = new (AuthService as any).constructor();
      
      mockAuthClient.login.mockImplementation((options: any) => {
        setTimeout(() => options.onSuccess(), 0);
      });

      await authService.login();
      
      expect(MockedHttpAgent).toHaveBeenCalledWith({
        identity: mockIdentity,
        host: 'https://custom-ic-host.com',
      });
    });

    it('should fetch root key in development environment', async () => {
      process.env.NODE_ENV = 'development';
      const authService = new (AuthService as any).constructor();
      
      mockAuthClient.login.mockImplementation((options: any) => {
        setTimeout(() => options.onSuccess(), 0);
      });

      await authService.login();
      
      expect(mockAgent.fetchRootKey).toHaveBeenCalledTimes(1);
    });

    it('should not fetch root key in production environment', async () => {
      process.env.NODE_ENV = 'production';
      const authService = new (AuthService as any).constructor();
      
      mockAuthClient.login.mockImplementation((options: any) => {
        setTimeout(() => options.onSuccess(), 0);
      });

      await authService.login();
      
      expect(mockAgent.fetchRootKey).not.toHaveBeenCalled();
    });

    it('should handle root key fetch errors gracefully', async () => {
      process.env.NODE_ENV = 'development';
      const authService = new (AuthService as any).constructor();
      
      mockAgent.fetchRootKey.mockRejectedValue(new Error('Root key fetch failed'));
      mockAuthClient.login.mockImplementation((options: any) => {
        setTimeout(() => options.onSuccess(), 0);
      });

      // Should not throw error
      await expect(authService.login()).resolves.toBeUndefined();
    });
  });

  describe('Getters', () => {
    it('should return current agent', () => {
      const authService = new (AuthService as any).constructor();
      authService.agent = mockAgent;
      
      expect(authService.getAgent()).toBe(mockAgent);
    });

    it('should return null when no agent is set', () => {
      const authService = new (AuthService as any).constructor();
      
      expect(authService.getAgent()).toBeNull();
    });

    it('should return current actor', () => {
      const authService = new (AuthService as any).constructor();
      const mockActor = { someMethod: jest.fn() };
      authService.actor = mockActor;
      
      expect(authService.getActor()).toBe(mockActor);
    });

    it('should return null when no actor is set', () => {
      const authService = new (AuthService as any).constructor();
      
      expect(authService.getActor()).toBeNull();
    });
  });
});
