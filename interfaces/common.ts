export interface Fandom {
  image: string;
  name: string;
}

export interface FriendMap {
  id: string;
  name: string;
  stats?: number[];
  score?: number;
}

export interface FriendRequest {
  id: string;
  name: string;
}

export interface UserData {
  email: string;
  id: string;
  name: string;
  stats?: number[];
  friends?: FriendMap;
  fandoms?: Record<string, Fandom>;
  friendRequests?: FriendRequest;
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
