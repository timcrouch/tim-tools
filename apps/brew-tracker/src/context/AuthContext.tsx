import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { isPinSet, verifyPin, setPin } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  needsSetup: boolean;
  login: (pin: string) => Promise<boolean>;
  setupPin: (pin: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = 'brew-tracker-session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    setIsLoading(true);
    
    // Check if PIN is set
    const pinExists = await isPinSet();
    
    if (!pinExists) {
      setNeedsSetup(true);
      setIsLoading(false);
      return;
    }

    // Check for existing session
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      const { timestamp } = JSON.parse(session);
      if (Date.now() - timestamp < SESSION_DURATION) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    
    setIsLoading(false);
  }

  async function login(pin: string): Promise<boolean> {
    const valid = await verifyPin(pin);
    if (valid) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ timestamp: Date.now() }));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }

  async function setupPin(pin: string): Promise<boolean> {
    const success = await setPin(pin);
    if (success) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ timestamp: Date.now() }));
      setIsAuthenticated(true);
      setNeedsSetup(false);
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      needsSetup,
      login,
      setupPin,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
