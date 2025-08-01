import type { Cache } from "./Cache";
import { LocalStorageCache } from "./LocalStorageCache";
import { MemoryCache } from "./MemoryCache";

class MultiLevelCache implements Cache {
    private cacheLevels: Cache[];

    constructor(cacheLevels: Cache[]) {
        this.cacheLevels = cacheLevels;
    }

    get<T>(key: string): T | null {
        for (let i = 0; i < this.cacheLevels.length; i++) {
            const value = this.cacheLevels[i].get<T>(key);
            if (value !== null) {
                for (let j = 0; j < i; j++) {
                    this.cacheLevels[j].set(key, value);
                }
                return value;
            }
        }
        return null;
    }

    set<T>(key: string, value: T): boolean {
        let success = false;
        for (const level of this.cacheLevels) {
            success = success || level.set(key, value);
        }
        return success;
    }

    delete(key: string): boolean {
        let success = false;
        for (const level of this.cacheLevels) {
            success = success || level.delete(key);
        }
        return success;
    }

    isAvailable(): boolean {
        for (const level of this.cacheLevels) {
            if (level.isAvailable())
                return true;
        }
        return false;
    }
}


export const defaultMultiLevelCache = new MultiLevelCache([
    new MemoryCache(),
    new LocalStorageCache()
]);