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
  score?: number
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  fandoms: Record<string, Fandom>;

  stats: [number, number, number]; // [score, games, rank]
  friends?: Record<string, FriendData>;
  friendRequests?: FriendData[];

}
export interface User {
  uid: string;
  email: string;
  displayName: string;
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