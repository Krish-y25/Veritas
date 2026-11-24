import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'veritas_token';
const ISSUER_KEY = 'veritas_issuer';

/**
 * Authentication Context Provider managing token, issuer details, and localStorage persistence.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [issuer, setIssuer] = useState(() => {
    try {
      const stored = localStorage.getItem(ISSUER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (data) => {
    if (data?.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
    }
    if (data?.issuer) {
      localStorage.setItem(ISSUER_KEY, JSON.stringify(data.issuer));
      setIssuer(data.issuer);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ISSUER_KEY);
    setToken(null);
    setIssuer(null);
  };

  const value = {
    token,
    issuer,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
