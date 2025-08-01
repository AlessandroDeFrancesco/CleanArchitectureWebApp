import type { Cache } from "./Cache";

export class MemoryCache implements Cache {
    private cache = new Map<string, any>();

    get<T>(key: string): T | null {
        return this.cache.has(key) ? this.cache.get(key) : null;
    }

    set<T>(key: string, value: T): boolean {
        try {
            this.cache.set(key, value);
            return true;
        } catch {
            return false;
        }
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    isAvailable(): boolean {
        return true;
    }
}
