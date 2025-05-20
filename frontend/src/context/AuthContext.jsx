import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
    accountType: null,
    isLoading: true
  });

  useEffect(() => {
    // Check if user is already logged in on app load
    const token = localStorage.getItem('authToken');
    const accountType = localStorage.getItem('accountType');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    
    console.log('AuthContext initial load - token:', !!token, 'accountType:', accountType, 'userId:', userId, 'userRole:', userRole);
    
    if (token) {
      setAuthState({
        isAuthenticated: true,
        user: { 
          id: userId, 
          role: userRole,
          // Add these fields to ensure they're available for role-based navigation
          _id: userId  
        },
        token,
        accountType,
        isLoading: false
      });
      console.log('Set authenticated state from localStorage');
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      console.log('No token found, user not authenticated');
    }
  }, []);

  // Login
  const login = (data) => {
    const { token, accountType, user } = data;
    
    console.log('Auth context login called with:', data);
    
    if (!user) {
      console.error('Login called without user data');
      throw new Error('User data is required for login');
    }
    
    // Normalize user data - backend may send it in different formats
    const userId = user.id || user._id;
    const userRole = user.role;
    
    if (!userId) {
      console.error('User ID missing in login data:', user);
      throw new Error('User ID is required for login');
    }
    
    if (!userRole) {
      console.error('User role missing in login data:', user);
      throw new Error('User role is required for login');
    }
    
    console.log('Normalized user data - userId:', userId, 'userRole:', userRole, 'accountType:', accountType);
    
    // Store in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('accountType', accountType);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRole', userRole);
    
    console.log('LocalStorage updated with authentication data');
    
    // Update state
    setAuthState(prev => {
      const newState = {
        ...prev,
        isAuthenticated: true,
        user: {
          ...user,       // Include all user data
          id: userId,    // Ensure ID is included
          _id: userId,   // Include both formats
          role: userRole // Ensure role is included
        },
        token: token,
        accountType: accountType,
        isLoading: false
      };
      
      console.log('Updated auth state:', newState);
      return newState;
    });
    
    return {
      ...data,
      user: {
        ...user,
        id: userId,
        role: userRole
      }
    }; // Return normalized data
  };

  // Logout
  const logout = async () => {
    try {
      console.log('Logging out user');
      
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('accountType');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      
      console.log('LocalStorage auth data cleared');
      
      // Reset state
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        accountType: null,
        isLoading: false
      });
      
      console.log('Auth state reset');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local storage and state even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('accountType');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        accountType: null,
        isLoading: false
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 