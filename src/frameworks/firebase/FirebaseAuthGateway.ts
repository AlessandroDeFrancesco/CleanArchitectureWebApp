import type { AuthService, AuthUser } from "../../application/services/AuthService";
import { createError, createResult, type Result } from "../../utils/Result";
import { firebaseAuth } from "./Firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";

export class FirebaseAuthAdapter implements AuthService {
  async getUserId(): Promise<Result<string, "NotLoggedIn" | "Other">> {
    await firebaseAuth.authStateReady?.();
    var id = firebaseAuth.currentUser?.uid ?? null;
    if (id)
      return createResult(id);
    return createError("NotLoggedIn");
  }

  async getUser(): Promise<Result<AuthUser, "NotLoggedIn" | "Other">> {
    await firebaseAuth.authStateReady?.();
    var user = firebaseAuth.currentUser;
    if (user)
      return createResult(toAuthGatewayUserDto(user));
    return createError("NotLoggedIn");
  }

  async signIn(email: string, password: string): Promise<Result<void, "InvalidCrendentials" | "Other">> {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      return createResult(undefined);
    } catch (e) {
      return createError("InvalidCrendentials");
    }
  }

  async signOut(): Promise<Result<void, "Other">> {
    try {
      await signOut(firebaseAuth);
      return createResult(undefined);
    } catch (e) {
      return createError("Other");
    }
  }

  isLoggedIn(): boolean {
    return firebaseAuth.currentUser != null;
  }

  subscribe(callback: (user: AuthUser | null) => void): () => void {
    const unsubscribe = firebaseOnAuthStateChanged(firebaseAuth, (firebaseUser) => {
      const user = firebaseUser ? toAuthGatewayUserDto(firebaseUser) : null;
      callback(user);
    });
    return unsubscribe;
  }
}

function toAuthGatewayUserDto(firebaseUser: FirebaseUser): AuthUser {
    return {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? undefined,
        displayName: firebaseUser.displayName ?? undefined,
        photoURL: firebaseUser.photoURL ?? undefined,
    };
}