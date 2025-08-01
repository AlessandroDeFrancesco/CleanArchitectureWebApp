import type { User as FirebaseUser } from "firebase/auth";
import type { AuthUser } from "../../application/services/AuthService";

export function toAuthUser(firebaseUser: FirebaseUser): AuthUser {
    return {
        id: firebaseUser.uid,
        email: firebaseUser.email ?? undefined,
        displayName: firebaseUser.displayName ?? undefined,
        photoURL: firebaseUser.photoURL ?? undefined,
    };
}