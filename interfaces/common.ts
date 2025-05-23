export interface Fandom {
  image: string;
  name: string;
}

export interface FriendData {
  id: string;
  name: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  fandoms: Record<string, Fandom>;
  friends: Record<string, FriendData>;
  stats: [number, number, number]; // [score, games, rank]
  friendRequests?: FriendData[];
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
  text: string;
  finishReason?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
}

