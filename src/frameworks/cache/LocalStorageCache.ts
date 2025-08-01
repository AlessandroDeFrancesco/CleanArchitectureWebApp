import type { Cache } from "./Cache";

export class LocalStorageCache implements Cache {
    get<T>(key: string): T | null {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) as T : null;
        } catch {
            return null;
        }
    }

    set<T>(key: string, value: T): boolean {
        if (!this.isAvailable()) {
            this.tryClearLocalStorage();
            return false;
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    }

    delete(key: string): boolean {
        if (!this.isAvailable()) {
            this.tryClearLocalStorage();
            return false;
        }
        try {
            localStorage.removeItem(key);
            return true;
        } catch {
            return false;
        }
    }

    isAvailable(): boolean {
        try {
            localStorage.setItem("__test", "1");
            localStorage.removeItem("__test");
            return true;
        } catch {
            return false;
        }
    }

    tryClearLocalStorage() {
        try {
            localStorage.clear();
            return true;
        } catch {
            return false;
        }
    }
}
