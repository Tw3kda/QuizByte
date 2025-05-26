// utils/geminiApi.ts

const ip = process.env.EXPO_PUBLIC_API_IP

// Asegúrate que esté sin "/" final

type GameResult = {
  name: string;
  imageUrl: string | null;
};

export const fetchGeminiImgResponse = async (
  request: { prompt: string; imageBase64: string }
): Promise<GameResult[]> => {
  const response = await fetch(`https://quiz-byte-api.vercel.app/gemini-vision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const text = await response.text(); // obtener la respuesta como texto
  console.log("Respuesta cruda del backend:", text);

  try {
    const data = JSON.parse(text);
    console.log("Parsed JSON:", JSON.stringify(data, null, 2));
    return data.searchResults;
  } catch (err) {
    console.error("No se pudo parsear JSON:", err);
    throw err;
  }
};
