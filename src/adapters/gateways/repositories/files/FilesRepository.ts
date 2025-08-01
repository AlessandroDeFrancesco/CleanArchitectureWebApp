import type { FilesRepositoryService } from "../../../../application/services/repositories/FilesRepositoryService";
import type { CreateType, UpdateType } from "../../../../application/services/repositories/RepositoryService";
import type { FileEntity } from "../../../../domain/entities/FileEntity";
import { createResult, isError, type Result } from "../../../../utils/Result";
import type { FileRepositoryDto } from "./FileRepositoryDto";

export interface FilesRepositoryAdapter {
    getAll(): Promise<Result<FileRepositoryDto[], Error>>;
    get(id: string): Promise<Result<FileRepositoryDto, Error>>;
    create(item: CreateType<FileRepositoryDto>): Promise<Result<string, Error>>;
    update(item: UpdateType<FileRepositoryDto>): Promise<Result<string, Error>>;
    delete(id: string): Promise<Result<string, Error>>;
}

export class FilesRepository implements FilesRepositoryService {
    private adapter: FilesRepositoryAdapter;

    constructor(adapter: FilesRepositoryAdapter) {
        this.adapter = adapter;
    }

    async getAll(): Promise<Result<FileEntity[], Error>> {
        const result = await this.adapter.getAll();
        if (isError(result))
            return result;
        return createResult(result.value.map(toFileEntity));
    }

    async get(id: string): Promise<Result<FileEntity, Error>> {
        const result = await this.adapter.get(id);
        if (isError(result))
            return result;
        return createResult(toFileEntity(result.value));
    }

    async create(item: CreateType<FileEntity>): Promise<Result<string, Error>> {
        return this.adapter.create(toCreateFileRepositoryDto(item));
    }

    async update(item: UpdateType<FileEntity>): Promise<Result<string, Error>> {
        return this.adapter.update(toUpdateFileRepositoryDto(item));
    }

    async delete(id: string): Promise<Result<string, Error>> {
        return this.adapter.delete(id);
    }
}

function toFileEntity(value: FileRepositoryDto): FileEntity {
    return {
        id: value.id,
        name: value.name,
        createdAt: new Date(value.createdAtMillis),
        mimeType: value.mimeType,
        content: value.contentBase64
    };
}

function toCreateFileRepositoryDto(value: CreateType<FileEntity>): CreateType<FileRepositoryDto> {
    return {
        name: value.name,
        createdAtMillis: value.createdAt.getTime(),
        mimeType: value.mimeType,
        contentBase64: value.content
    };
}

function toUpdateFileRepositoryDto(value: UpdateType<FileEntity>): UpdateType<FileRepositoryDto> {
    return {
        id: value.id,
        name: value.name,
        createdAtMillis: value.createdAt?.getTime(),
        mimeType: value.mimeType,
        contentBase64: value.content
    };
}