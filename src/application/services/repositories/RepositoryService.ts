import type { Result } from "../../../utils/Result";
import type { Service } from "../Service";

export interface RepositoryResource {
    id: string;
};

export interface RepositoryService<T extends RepositoryResource> extends Service {
    getAll(): Promise<Result<T[], Error>>;
    get(id: string): Promise<Result<T, Error>>;
    create(item: CreateType<T>): Promise<Result<string, Error>>;
    update(item: UpdateType<T>): Promise<Result<string, Error>>;
    delete(id: string): Promise<Result<string, Error>>;
}

export type CreateType<T extends { id: any }> = Omit<T, "id">;

export type UpdateType<T extends { id: any }> = {
  id: T["id"];
} & Partial<Omit<T, "id">>;