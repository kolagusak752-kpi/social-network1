export interface User {
  id: number;
  username: string;
  avatars: { url: string, originalAvatarUrl: string } | null;
  bio: string | null;
  email: string | null;
  isPrivate: boolean;
  updatedAt: string;
  isVerified: boolean;
  createdAt: string;
  posts: { id: number, content: string, createdAt: string, media: any[], description: string }[]
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