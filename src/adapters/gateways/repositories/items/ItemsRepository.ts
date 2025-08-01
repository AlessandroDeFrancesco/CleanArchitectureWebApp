import type { CreateType, UpdateType } from "../../../../application/services/repositories/RepositoryService";
import type { ItemsRepositoryService } from "../../../../application/services/repositories/ItemsRepositoryService";
import type { ItemEntity } from "../../../../domain/entities/ItemEntity";
import { createResult, isError, type Result } from "../../../../utils/Result";
import type { ItemRepositoryDto } from "./ItemRepositoryDto";

export interface ItemsRepositoryAdapter {
    getAll(): Promise<Result<ItemRepositoryDto[], Error>>;
    get(id: string): Promise<Result<ItemRepositoryDto, Error>>;
    create(item: CreateType<ItemRepositoryDto>): Promise<Result<string, Error>>;
    update(item: UpdateType<ItemRepositoryDto>): Promise<Result<string, Error>>;
    delete(id: string): Promise<Result<string, Error>>;
}

export class ItemsRepository implements ItemsRepositoryService {
    private adapter: ItemsRepositoryAdapter;

    constructor(adapter: ItemsRepositoryAdapter) {
        this.adapter = adapter;
    }

    async getAll(): Promise<Result<ItemEntity[], Error>> {
        const result = await this.adapter.getAll();
        if (isError(result))
            return result;
        return createResult(result.value.map(toItemEntity));
    }

    async get(id: string): Promise<Result<ItemEntity, Error>> {
        const result = await this.adapter.get(id);
        if (isError(result))
            return result;
        return createResult(toItemEntity(result.value));
    }

    async create(item: CreateType<ItemEntity>): Promise<Result<string, Error>> {
        return this.adapter.create(toCreateItemRepositoryDto(item));
    }

    async update(item: UpdateType<ItemEntity>): Promise<Result<string, Error>> {
        return this.adapter.update(toUpdateItemRepositoryDto(item));
    }

    async delete(id: string): Promise<Result<string, Error>> {
        return this.adapter.delete(id);
    }
}

function toItemEntity(value: ItemRepositoryDto): ItemEntity {
    return {
        id: value.id,
        name: value.name,
        description: value.description,
        createdAt: new Date(value.createdAtMillis),
        modifiedAt: new Date(value.modifiedAtMillis),
        imageIds: value.imageIds
    };
}

function toCreateItemRepositoryDto(value: CreateType<ItemEntity>): CreateType<ItemRepositoryDto> {
    return {
        name: value.name,
        description: value.description,
        createdAtMillis: value.createdAt.getTime(),
        modifiedAtMillis: value.modifiedAt.getTime(),
        imageIds: value.imageIds
    };
}

function toUpdateItemRepositoryDto(value: UpdateType<ItemEntity>): UpdateType<ItemRepositoryDto> {
    return {
        id: value.id,
        name: value.name,
        description: value.description,
        createdAtMillis: value.createdAt?.getTime(),
        modifiedAtMillis: value.modifiedAt?.getTime(),
        imageIds: value.imageIds
    };
}