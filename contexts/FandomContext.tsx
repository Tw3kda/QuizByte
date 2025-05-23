import React, { createContext, useContext, useState } from "react";
import { FandomItem } from "../interfaces/common";

const FandomContext = createContext<FandomContextType | undefined>(undefined);

interface FandomContextType {
  results: FandomItem[];
  isLoading: boolean;
  error: string | null;
  fetchFandoms: (searchTerm: string) => Promise<void>;
  clearResults: () => void;
}

export const FandomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [results, setResults] = useState<FandomItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFandoms = async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://192.168.1.5:3001/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchTerm }),
      });

      const data = await response.json();

      setResults(data);
    } catch (err) {
      setError("Failed to fetch fandoms.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]); // 👈 aquí se "limpia" todo lo que sale en el .map
  };

  return (
    <FandomContext.Provider
      value={{ results, isLoading, error, fetchFandoms, clearResults }}
    >
      {children}
    </FandomContext.Provider>
  );
};

export const useFandom = () => {
  const context = useContext(FandomContext);
  if (!context) {
    throw new Error("useFandom must be used within a FandomProvider");
  }
  return context;
};
