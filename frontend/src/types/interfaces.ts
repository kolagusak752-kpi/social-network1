export interface User {
  id: number;
  username: string;
  avatar: string | undefined;
  bio: string | null;
  email: string | null;
  isPrivate: boolean;
  updatedAt: string;
  isVerified: boolean;
  createdAt: string;
}
export interface AuthContext {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  checkAuth: () => void;
}
export interface Participant {
  conversationId: string
  id: string
  user: User
  userId: string
}
export interface Conversation {
    createdAt: string;
    id: string;
    partiipants: Participant[]
}
export interface ChatImage {
  file:File;
  url:string;
}