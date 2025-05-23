export interface Fandom {
  image: string;
  name: string;
}

export interface Friend {
  ID: string;
  Name: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  fandoms: Record<string, Fandom>;
  friends: Record<string, Friend>;
  stats: [number, number, number]; // [score, games, rank]
}

export interface FandomItem {
  name: string;
  imageUrl: string;
}

export interface GeminiRequest {
  prompt: string;
  imageBase64?: string;
}

export interface GeminiResponse {
  games: null;
  text: string;
  finishReason?: string;
}
