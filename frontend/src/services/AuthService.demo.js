/**
 * AuthService Integration Demo
 * 
 * This file demonstrates how to use the AuthService in a real React application.
 * Run this with: node src/services/AuthService.demo.js
 * 
 * This shows practical usage patterns without complex testing setup.
 */

console.log('=== AuthService Integration Demo ===\n');

// Mock environment for demo purposes
process.env.NODE_ENV = 'development';
process.env.REACT_APP_II_URL = 'https://identity.ic0.app';
process.env.REACT_APP_IC_HOST = 'https://ic0.app';

// Simple utility to demonstrate error handling
const demoWithErrorHandling = async (title, asyncFunction) => {
  console.log(`📋 ${title}`);
  try {
    const result = await asyncFunction();
    console.log(`✅ Success: ${title}`);
    return { success: true, result };
  } catch (error) {
    console.log(`❌ Error in ${title}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Demo function to show basic AuthService usage patterns
const demonstrateAuthService = async () => {
  console.log('🚀 Starting AuthService demonstration...\n');

  // Note: Since we can't actually import the AuthService here due to ES modules,
  // this demo shows the usage patterns you would use in your React components

  const authUsageExamples = {
    // Example 1: Basic initialization
    initialization: async () => {
      console.log('1️⃣ AuthService Initialization Pattern:');
      console.log(`
// In your React component or service initialization:
import authService from './services/AuthService';

// Initialize the service
await authService.init();
console.log('AuthService initialized successfully');
      `);
    },

    // Example 2: Check authentication status
    checkAuthentication: async () => {
      console.log('2️⃣ Authentication Check Pattern:');
      console.log(`
// Check if user is authenticated
const authStatus = await authService.checkAuth();

if (authStatus.isAuthenticated) {
  console.log('User is authenticated');
  console.log('Principal:', authStatus.principal?.toString());
  console.log('Roles:', authStatus.roles);
} else {
  console.log('User is not authenticated');
}
      `);
    },

    // Example 3: Login flow
    loginFlow: async () => {
      console.log('3️⃣ Login Flow Pattern:');
      console.log(`
// Initiate login (this will open Internet Identity)
try {
  await authService.login();
  
  // After successful login, check auth status
  const authStatus = await authService.checkAuth();
  
  if (authStatus.isAuthenticated) {
    // User is now logged in
    console.log('Login successful!');
    console.log('Principal:', authStatus.principal?.toString());
    
    // Get authenticated agent for backend calls
    const agent = authService.getAgent();
    const actor = authService.getActor();
    
    // Now you can make authenticated calls to your backend
  }
} catch (error) {
  console.error('Login failed:', error);
  // Handle login error (show user message, etc.)
}
      `);
    },

    // Example 4: Logout flow
    logoutFlow: async () => {
      console.log('4️⃣ Logout Flow Pattern:');
      console.log(`
// Logout user
try {
  await authService.logout();
  console.log('Logout successful');
  
  // Verify logout
  const authStatus = await authService.checkAuth();
  console.log('Authenticated after logout:', authStatus.isAuthenticated); // Should be false
  
} catch (error) {
  console.error('Logout failed:', error);
}
      `);
    },

    // Example 5: React Hook Pattern
    reactHookPattern: async () => {
      console.log('5️⃣ React Hook Usage Pattern:');
      console.log(`
// Custom hook for authentication
import { useState, useEffect } from 'react';
import authService from './services/AuthService';

export const useAuth = () => {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    loading: true,
    principal: null,
    roles: []
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await authService.init();
        const status = await authService.checkAuth();
        setAuthStatus({
          ...status,
          loading: false
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthStatus({
          isAuthenticated: false,
          loading: false,
          principal: null,
          roles: [],
          error: error.message
        });
      }
    };

    checkAuthentication();
  }, []);

  const login = async () => {
    try {
      await authService.login();
      const status = await authService.checkAuth();
      setAuthStatus({ ...status, loading: false });
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthStatus({
        isAuthenticated: false,
        loading: false,
        principal: null,
        roles: []
      });
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    ...authStatus,
    login,
    logout
  };
};
      `);
    },

    // Example 6: Component usage
    componentUsage: async () => {
      console.log('6️⃣ React Component Usage Pattern:');
      console.log(`
// Using the auth hook in a component
import React from 'react';
import { useAuth } from './hooks/useAuth';

const AuthButton = () => {
  const { isAuthenticated, loading, principal, login, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {principal?.toString().substring(0, 8)}...</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <button onClick={login}>
      Login with Internet Identity
    </button>
  );
};

export default AuthButton;
      `);
    },

    // Example 7: Error handling patterns
    errorHandling: async () => {
      console.log('7️⃣ Error Handling Patterns:');
      console.log(`
// Robust error handling for authentication operations
const safeAuthOperation = async (operation, operationName) => {
  try {
    const result = await operation();
    return { success: true, result };
  } catch (error) {
    console.error(\`\${operationName} failed:\`, error);
    
    // You might want to show user-friendly error messages
    let userMessage = 'An error occurred. Please try again.';
    
    if (error.message.includes('network')) {
      userMessage = 'Network error. Please check your connection.';
    } else if (error.message.includes('identity')) {
      userMessage = 'Authentication error. Please try logging in again.';
    }
    
    return { 
      success: false, 
      error: error.message, 
      userMessage 
    };
  }
};

// Usage:
const loginResult = await safeAuthOperation(
  () => authService.login(),
  'Login'
);

if (loginResult.success) {
  console.log('Login successful!');
} else {
  alert(loginResult.userMessage);
}
      `);
    }
  };

  // Run all examples
  for (const [key, example] of Object.entries(authUsageExamples)) {
    await example();
    console.log(''); // Empty line for readability
  }

  console.log('🎉 AuthService demonstration completed!\n');
  
  console.log('📝 Key Takeaways:');
  console.log('   • Always initialize AuthService before use');
  console.log('   • Handle authentication errors gracefully');
  console.log('   • Check authentication status after login/logout');
  console.log('   • Use React hooks to manage auth state');
  console.log('   • Provide user-friendly error messages');
  console.log('   • Test authentication flows thoroughly');
};

// Demo of testing patterns
const demonstrateTestingPatterns = async () => {
  console.log('🧪 Testing Patterns for AuthService:\n');
  
  console.log('1️⃣ Unit Testing Pattern:');
  console.log(`
// Mock the DFINITY dependencies
jest.mock('@dfinity/auth-client', () => ({
  AuthClient: {
    create: jest.fn(() => Promise.resolve({
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: jest.fn(() => Promise.resolve(false)),
      getIdentity: jest.fn(() => ({
        getPrincipal: () => ({ toString: () => 'mock-principal' })
      }))
    }))
  }
}));

// Test authentication flow
describe('AuthService', () => {
  it('should handle login flow', async () => {
    const authService = await import('./AuthService');
    await expect(authService.default.init()).resolves.not.toThrow();
    
    // Test other methods...
  });
});
  `);

  console.log('2️⃣ Integration Testing Pattern:');
  console.log(`
// Test with real components
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthButton from './AuthButton';

// Mock only what's necessary for integration tests
jest.mock('./services/AuthService', () => ({
  init: jest.fn(() => Promise.resolve()),
  checkAuth: jest.fn(() => Promise.resolve({
    isAuthenticated: false,
    roles: []
  })),
  login: jest.fn(() => Promise.resolve()),
  logout: jest.fn(() => Promise.resolve())
}));

test('should show login button when not authenticated', async () => {
  render(<AuthButton />);
  
  await waitFor(() => {
    expect(screen.getByText('Login with Internet Identity')).toBeInTheDocument();
  });
});
  `);

  console.log('3️⃣ E2E Testing Considerations:');
  console.log(`
// For E2E tests, you might want to:
// 1. Test with a local Internet Identity instance
// 2. Use test identities for consistent results
// 3. Mock network calls to your backend
// 4. Test the full authentication flow
// 5. Verify UI updates after authentication changes
  `);
};

// Run the demonstration
const runDemo = async () => {
  try {
    await demonstrateAuthService();
    await demonstrateTestingPatterns();
    
    console.log('✨ Demo completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Review the code patterns above');
    console.log('   2. Implement the useAuth hook in your React app');
    console.log('   3. Create components that use the authentication service');
    console.log('   4. Add proper error handling and user feedback');
    console.log('   5. Write tests for your authentication flows');
    console.log('   6. Test with real Internet Identity integration');
    
  } catch (error) {
    console.error('Demo failed:', error);
  }
};

// Run the demo
runDemo();
