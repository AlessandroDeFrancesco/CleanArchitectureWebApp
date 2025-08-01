import { collection, getDocs, doc, getDoc, addDoc, type DocumentData, updateDoc, deleteDoc } from "firebase/firestore";
import { firebaseDb } from "../Firebase";
import { createError, createResult, isError, type Result } from "../../../utils/Result";
import type { CreateType, RepositoryResource, UpdateType } from "../../../application/services/repositories/RepositoryService";
import type { AuthService } from "../../../application/services/AuthService";
import type { Cache } from "../../cache/Cache";

export abstract class FirebaseRepository<T extends RepositoryResource> {
    protected readonly auth: AuthService;
    protected readonly cache: Cache;

    constructor(auth: AuthService, cache: Cache) {
        this.auth = auth;
        this.cache = cache;
    }

    protected abstract getCollectionPath(): string;

    protected async getUserId(): Promise<string> {
        const result = await this.auth.getUserId();
        if (isError(result))
            throw new Error("User not logged in");
        return result.value;
    }

    protected async getCacheKey(id: string): Promise<string> {
        return `${await this.getUserId()}:${this.getCollectionPath()}:${id}`;
    }

    async getAll(): Promise<Result<T[], Error>> {
        try {
            const col = collection(firebaseDb, "users", await this.getUserId(), this.getCollectionPath());
            const snap = await getDocs(col);
            const docs = snap.docs;
            const items = await Promise.all(
                docs.map(async (doc) => {
                    const item = { id: doc.id, ...doc.data() } as T;
                    const key = await this.getCacheKey(doc.id);
                    this.cache.set(key, item);
                    return item;
                })
            );
            return createResult(items);
        } catch (err) {
            return createError(new Error(`${err}`));
        }
    }

    async get(id: string): Promise<Result<T, Error>> {
        try {
            const cacheKey = await this.getCacheKey(id);
            const cached = this.cache.get<T>(cacheKey);
            if (cached !== null) {
                return createResult(cached);
            }

            const ref = doc(firebaseDb, "users", await this.getUserId(), this.getCollectionPath(), id);
            const snap = await getDoc(ref);
            if (!snap.exists()) {
                return createError(new Error("Missing id"));
            }

            const item = { id: snap.id, ...snap.data() } as T;
            this.cache.set(cacheKey, item);
            return createResult(item);
        } catch (err) {
            return createError(new Error(`${err}`));
        }
    }

    async create(item: CreateType<T>): Promise<Result<string, Error>> {
        try {
            const data = item;
            const col = collection(firebaseDb, "users", await this.getUserId(), this.getCollectionPath());
            const docRef = await addDoc(col, data as DocumentData);
            const finalItem = { ...item, id: docRef.id };
            this.cache.set(await this.getCacheKey(docRef.id), finalItem);
            return createResult(docRef.id);
        } catch (err) {
            return createError(new Error(`${err}`));
        }
    }

    async update(item: UpdateType<T>): Promise<Result<string, Error>> {
        try {
            const { id, ...rawData } = item;
            const data = removeUndefinedFields(rawData);
            const ref = doc(firebaseDb, "users", await this.getUserId(), this.getCollectionPath(), id);
            await updateDoc(ref, data as DocumentData);
            this.cache.set(await this.getCacheKey(id), item);
            return createResult(id);
        } catch (err) {
            return createError(new Error(`${err}`));
        }
    }

    async delete(id: string): Promise<Result<string, Error>> {
        try {
            const ref = doc(firebaseDb, "users", await this.getUserId(), this.getCollectionPath(), id);
            await deleteDoc(ref);
            this.cache.delete(await this.getCacheKey(id));
            return createResult(id);
        } catch (err) {
            return createError(new Error(`${err}`));
        }
    }
}

function removeUndefinedFields<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  ) as Partial<T>;
}