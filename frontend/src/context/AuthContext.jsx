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
    
    if (token) {
      setAuthState({
        isAuthenticated: true,
        user: { id: userId, role: userRole },
        token,
        accountType,
        isLoading: false
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Login
  const login = (data) => {
    const { token, accountType, user } = data;
    
    console.log('Auth context login called with:', data);
    
    // Store in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('accountType', accountType);
    if (user?.id) localStorage.setItem('userId', user.id);
    if (user?.role) localStorage.setItem('userRole', user.role);
    
    // For profile updates (when token already exists), we don't update these values
    // but we still want to update the user state with the new profile information
    
    // Update state
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: true,
      user: {
        ...prev.user,  // Keep existing user data
        ...user,       // Merge with new user data
      },
      token: token || prev.token,
      accountType: accountType || prev.accountType,
      isLoading: false
    }));
  };

  // Logout
  const logout = async () => {
    try {
      // Call logout API if needed
      // await api.post('/api/user/logout');
      
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('accountType');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      
      // Reset state
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        accountType: null,
        isLoading: false
      });
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