// utils/geminiApi.ts

const ip = process.env.EXPO_PUBLIC_API_IP

const BACKEND_URL = `http://${ip}:3001`; // Asegúrate que esté sin "/" final

type GameResult = {
  name: string;
  imageUrl: string | null;
};

export const fetchGeminiImgResponse = async (
  request: { prompt: string; imageBase64: string }
): Promise<GameResult[]> => {
  const response = await fetch(`${BACKEND_URL}/gemini-vision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  console.log("desde geminiapi.ts " + JSON.stringify(data, null, 2));
  return data.searchResults; // directamente el array de juegos
};
