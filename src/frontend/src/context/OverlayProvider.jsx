// src/context/OverlayProvider.jsx (예시)
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const OverlayContext = createContext();

export function OverlayProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <OverlayContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </OverlayContext.Provider>
  );
}

export function LoadingOverlay() {
  const { isLoading } = useContext(OverlayContext);

  if (!isLoading) return null;

  return (
    <div className="overlay">
      로딩중...
    </div>
  );
}
