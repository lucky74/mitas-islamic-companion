import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type InternetIdentityContextValue = {
  isAuthenticated: boolean;
  principal: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const InternetIdentityContext = createContext<InternetIdentityContextValue | undefined>(undefined);

function InternetIdentityProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsAuthenticated(false);
    setPrincipal(null);
  }, []);

  const login = async () => {
    setIsLoading(true);
    try {
      setIsAuthenticated(true);
      setPrincipal('anonymous');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setIsAuthenticated(false);
      setPrincipal(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InternetIdentityContext.Provider
      value={{
        isAuthenticated,
        principal,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </InternetIdentityContext.Provider>
  );
}

function useInternetIdentity() {
  const context = useContext(InternetIdentityContext);
  if (!context) {
    throw new Error('useInternetIdentity must be used within InternetIdentityProvider');
  }
  return context;
}

export { InternetIdentityProvider, useInternetIdentity };

