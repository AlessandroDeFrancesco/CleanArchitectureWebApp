import type { UseCase } from "../UseCase";
import { isOk } from "../../../utils/Result";
import type { FileEntity } from "../../../domain/entities/FileEntity";
import type { ItemEntity } from "../../../domain/entities/ItemEntity";
import type { ItemsRepositoryService } from "../../services/repositories/ItemsRepositoryService";
import type { FilesRepositoryService } from "../../services/repositories/FilesRepositoryService";

export interface UpdateItemUseCaseInputPort extends UseCase {
    update(request: UpdateItemRequest): Promise<void>;
}

export type UpdateItemRequest = {
    id: string;
    name?: string;
    description?: string;
    images?: {
        id?: string,
        name: string,
        mimeType: string,
        contentBase64: string
    }[];
}

interface RollbackContext {
    previous: ItemEntity;
    createdImages: FileEntity[];
    deletedImages: FileEntity[];
}

export class UpdateItemUseCase implements UpdateItemUseCaseInputPort {
    private itemsRepository: ItemsRepositoryService;
    private filesRepository: FilesRepositoryService;
    private outputPort: UpdateItemOutputPort;

    constructor(itemsRepository: ItemsRepositoryService, filesRepository: FilesRepositoryService, outputPort: UpdateItemOutputPort) {
        this.itemsRepository = itemsRepository;
        this.filesRepository = filesRepository;
        this.outputPort = outputPort;
    }

    async update(request: UpdateItemRequest): Promise<void> {
        await this.outputPort.presentLoading(true);

        const previous = await this.fetchPreviousState(request.id);
        if (!previous) {
            await this.outputPort.presentLoading(false);
            await this.outputPort.presentError(new Error(`Nothing to update with id ${request.id}`));
            return;
        }

        const rollbackContext: RollbackContext = {
            previous,
            createdImages: [],
            deletedImages: []
        };

        try {

            let imagesRepository: FileEntity[] | undefined;
            if (request.images) {
                const existingImages = await this.fetchExistingImages(previous.imageIds);
                imagesRepository = await this.syncImages(request.images, existingImages, rollbackContext);
            }

            const itemRepository = {
                id: request.id,
                name: request.name,
                description: request.description,
                modifiedAt: new Date(),
                imageIds: imagesRepository?.map(img => img.id)
            }

            const updateResult = await this.itemsRepository.update(itemRepository);
            if (!isOk(updateResult)) throw updateResult.error;

            await this.outputPort.presentUpdated(updateResult.value);

        } catch (err) {
            await this.rollback(rollbackContext);
            await this.outputPort.presentError(err instanceof Error ? err : new Error(String(err)));
        }

        await this.outputPort.presentLoading(false);
    }

    private async fetchPreviousState(id: string): Promise<ItemEntity | undefined> {
        const result = await this.itemsRepository.get(id);
        if (!isOk(result)) {
            return undefined;
        }
        return result.value;
    }

    private async fetchExistingImages(imageIds: string[]): Promise<FileEntity[]> {
        const images: FileEntity[] = [];
        for (const id of imageIds) {
            const result = await this.filesRepository.get(id);
            if (!isOk(result)) throw result.error;
            images.push(result.value);
        }
        return images;
    }

    private async syncImages(
        current: {
            id?: string,
            name: string,
            mimeType: string,
            contentBase64: string
        }[],
        existing: FileEntity[],
        ctx: RollbackContext
    ): Promise<FileEntity[]> {
        const resultImages: FileEntity[] = [];

        // New images
        const newImages = current.filter(img => !existing.some(e => e.id === img.id));
        for (const image of newImages) {
            const repositoryImage = {
                name: image.name,
                content: image.contentBase64,
                mimeType: image.mimeType,
                createdAt: new Date()
            };
            const result = await this.filesRepository.create(repositoryImage);
            if (!isOk(result)) throw result.error;

            const newId = result.value;
            const created = { ...repositoryImage, id: newId };
            image.id = newId;
            ctx.createdImages.push(created);
            resultImages.push(created);
        }

        // Deleted Images
        const deletedImages = existing.filter(e => !current.some(img => img.id === e.id));
        ctx.deletedImages.push(...deletedImages);
        for (const image of deletedImages) {
            const result = await this.filesRepository.delete(image.id);
            if (!isOk(result)) throw result.error;
        }

        // Add not deleted images
        const keptImages = existing.filter(e => !deletedImages.includes(e));
        resultImages.push(...keptImages);

        // Returned images, correctly ordered
        return resultImages.sort((a, b) => {
            const indexA = current.findIndex(c => c.id === a.id)
            const indexB = current.findIndex(c => c.id === b.id)
            return indexA - indexB
        });
    }

    private async rollback(ctx: RollbackContext): Promise<void> {
        for (const image of ctx.createdImages) {
            await this.filesRepository.delete(image.id);
        }

        for (const image of ctx.deletedImages) {
            await this.filesRepository.create(image);
        }

        await this.itemsRepository.update(ctx.previous);
    }
}

export interface UpdateItemOutputPort {
    presentLoading(isLoading: boolean): Promise<void>;
    presentUpdated(id: string): Promise<void>;
    presentError(error: Error): Promise<void>;
}
