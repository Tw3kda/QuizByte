export interface Fandom {
  image: string;
  name: string;
}


export interface Friend {
  ID: string;
  Name: string;

export interface FriendData {
  id: string;
  name: string;
  score?: number;

}

export interface UserData {
  id: string;
  email: string;
  name: string;
  fandoms: Record<string, Fandom>;

  friends: Record<string, Friend>;
  stats: [number, number, number]; // [score, games, rank]

  stats: [number, number, number]; // [score, games, rank]
  friends?: Record<string, FriendData>;
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
  games: null;
  text: string;
  finishReason?: string;
}
