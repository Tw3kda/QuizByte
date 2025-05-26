import React, { createContext, ReactNode, useContext, useState } from "react";
import { GeminiResponse } from "../interfaces/common";
import { fetchGeminiImgResponse } from "../utils/geminiApi";

interface GeminiContextType {
  response: GeminiResponse | null;
  loading: boolean;
  imagenUri: string | null;
  setImagenUri: (uri: string | null) => void;
  enviarImagenAGemini: (
    prompt: string,
    imageBase64: string
  ) => Promise<GameResult[] | null>;
  getResponse: (prompt: string) => Promise<string>;
}

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

type GameResult = {
  name: string;
  imageUrl: string | null;
};

export const GeminiProvider = ({ children }: { children: ReactNode }) => {

  const ip = process.env.EXPO_PUBLIC_API_IP

  const [imagenUri, setImagenUri] = useState<string | null>(null);
  const [response, setResponse] = useState<GeminiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const enviarImagenAGemini = async (
    prompt: string,
    imageBase64: string
  ): Promise<GameResult[] | null> => {
    try {
      const response = await fetchGeminiImgResponse({ prompt, imageBase64 });
      console.log("desde context:", JSON.stringify(response, null, 2));
      return response || null;
    } catch (error) {
      console.error("Error enviando imagen a Gemini:", error);
      return null;
    }
  };

  const getResponse = async (prompt: string): Promise<string> => {
    try {
      const res = await fetch(`https://quiz-byte-api.vercel.app/geminiText`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await res.json();
      return data?.text ?? "Sin respuesta";
    } catch (error) {
      console.error("Error al llamar a /geminiText:", error);
      return "Error al comunicarse con el servidor";
    }
  };

  return (
    <GeminiContext.Provider
      value={{
        response,
        loading,
        imagenUri,
        setImagenUri,
        enviarImagenAGemini,
        getResponse,
      }}
    >
      {children}
    </GeminiContext.Provider>
  );
};

export const useGemini = (): GeminiContextType => {
  const context = useContext(GeminiContext);
  if (!context) {
    throw new Error("useGemini debe usarse dentro de GeminiProvider");
  }
  return context;
};
