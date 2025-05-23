// contexts/GeminiContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";
import { GeminiResponse } from "../interfaces/common";
import {
  fetchGeminiImgResponse,
} from "../utils/geminiApi";

interface GeminiContextType {
  response: GeminiResponse | null;
  loading: boolean;
  imagenUri: string | null;
  setImagenUri: (uri: string | null) => void;
  //getResponse: (prompt: string) => Promise<void>;
  enviarImagenAGemini: (
    prompt: string,
    imageBase64: string
  ) => Promise<GameResult[] | null>; 
}

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);
type GameResult = {
  name: string;
  imageUrl: string | null;
};
export const GeminiProvider = ({ children }: { children: ReactNode }) => {
  const [imagenUri, setImagenUri] = useState<string | null>(null);
  const [response, setResponse] = useState<GeminiResponse | null>(null);
  const [loading, setLoading] = useState(false);

 // const getResponse = async (prompt: string) => {
   // setLoading(true);
  //  try {
      //const result = await fetchGeminiResponse({ prompt });
      //setResponse(result);
 //   } catch (error) {
 //     console.error("Error al obtener respuesta de Gemini:", error);
  //  } finally {
  //    setLoading(false);
  //c  }
  //};

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

  return (
    <GeminiContext.Provider
      value={{
        response,
        loading,
        imagenUri,
        setImagenUri,
        //getResponse,
        enviarImagenAGemini,
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
