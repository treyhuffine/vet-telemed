'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { MockUser, authenticateMockUser, getMockUserById } from '@/constants/mockAuth';

interface VetAuthContextType {
  userId?: string | null;
  user: MockUser | null;
  loading: boolean;
  error: string | null;
  isReady: boolean;
  isAuthenticated: boolean;
  isVet: boolean;
  isVetTech: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Alias for logout
}

const VetAuthContext = createContext<VetAuthContextType>({
  userId: null,
  user: null,
  loading: false,
  error: null,
  isReady: true,
  isAuthenticated: false,
  isVet: false,
  isVetTech: false,
  isAdmin: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  signOut: async () => {},
});

export function VetAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored session (mock implementation)
    const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('mockUserId') : null;
    if (storedUserId) {
      const storedUser = getMockUserById(storedUserId);
      if (storedUser) {
        setUser(storedUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const authenticatedUser = authenticateMockUser(email, password);
    
    if (authenticatedUser) {
      setUser(authenticatedUser);
      // Store in localStorage for persistence
      localStorage.setItem('mockUserId', authenticatedUser.id);
      setIsLoading(false);
      return { success: true };
    } else {
      setError('Invalid credentials');
      setIsLoading(false);
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setUser(null);
    localStorage.removeItem('mockUserId');
    setIsLoading(false);
  };

  const isAuthenticated = !!user;
  const isVet = user?.role === 'vet';
  const isVetTech = user?.role === 'vet_tech';
  const isAdmin = user?.role === 'admin';

  return (
    <VetAuthContext.Provider
      value={{
        userId: user?.id,
        user,
        loading: isLoading,
        error,
        isReady: !isLoading,
        isAuthenticated,
        isVet,
        isVetTech,
        isAdmin,
        login,
        logout,
        signOut: logout, // Alias for compatibility
      }}
    >
      {children}
    </VetAuthContext.Provider>
  );
}

export const useVetAuth = () => {
  const context = useContext(VetAuthContext);
  if (context === undefined) {
    throw new Error('useVetAuth must be used within a VetAuthProvider');
  }
  return context;
};