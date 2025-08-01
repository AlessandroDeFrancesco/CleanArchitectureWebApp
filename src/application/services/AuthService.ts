import type { Result } from "../../utils/Result";

export interface AuthService {
  getUserId(): Promise<Result<string, "NotLoggedIn" | "Other">>;
  getUser(): Promise<Result<AuthUser, "NotLoggedIn" | "Other">>;
  signIn(email: string, password: string): Promise<Result<void, "InvalidCrendentials" | "Other">>;
  signOut(): Promise<Result<void, "Other">>;
  isLoggedIn(): boolean;
  subscribe(callback: (user: AuthUser | null) => void): () => void;
}

export interface AuthUser {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}
