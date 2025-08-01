export interface Cache {
    get<T>(key: string): T | null;
    set<T>(key: string, value: T): boolean;
    delete(key: string): boolean;
    isAvailable(): boolean;
}