import type { UseCase } from "../UseCase";
import { isOk } from "../../../utils/Result";
import type { FileEntity } from "../../../domain/entities/FileEntity";
import type { FilesRepositoryService } from "../../services/repositories/FilesRepositoryService";
import type { ItemsRepositoryService } from "../../services/repositories/ItemsRepositoryService";

export interface CreateItemUseCaseInputPort extends UseCase {
    create(request: CreateItemRequest): Promise<void>;
}

export type CreateItemRequest = {
    name: string;
    description: string;
    images: {
        name: string,
        mimeType: string,
        contentBase64: string
    }[];
}

interface CreateRollbackContext {
    createdImages: FileEntity[];
}


export class CreateItemUseCase implements CreateItemUseCaseInputPort {
    private itemsRepository: ItemsRepositoryService;
    private filesRepository: FilesRepositoryService;
    private outputPort: CreateItemOutputPort;

    constructor(itemsRepository: ItemsRepositoryService, filesRepository: FilesRepositoryService, outputPort: CreateItemOutputPort) {
        this.itemsRepository = itemsRepository;
        this.filesRepository = filesRepository;
        this.outputPort = outputPort;
    }

    async create(request: CreateItemRequest): Promise<void> {
        await this.outputPort.presentLoading(true);

        const rollbackContext: CreateRollbackContext = {
            createdImages: []
        };

        try {
            const repositoryImages: FileEntity[] = [];
            const images = request.images;
            for (const image of images) {
                const repositoryImage = {
                    name: image.name,
                    content: image.contentBase64,
                    mimeType: image.mimeType,
                    createdAt: new Date()
                }
                const result = await this.filesRepository.create(repositoryImage);
                if (!isOk(result)) throw result.error;

                const repositoryImageWithId = { id: result.value, ...repositoryImage };
                rollbackContext.createdImages.push(repositoryImageWithId);
                repositoryImages.push(repositoryImageWithId);
            }

            const itemRepository = {
                name: request.name,
                description: request.description,
                imageIds: repositoryImages.map(image => image.id),
                createdAt: new Date(),
                modifiedAt: new Date()
            }
            const result = await this.itemsRepository.create(itemRepository);
            if (!isOk(result)) throw result.error;

            await this.outputPort.presentCreated(result.value);
        } catch (err) {
            await this.rollbackCreate(rollbackContext);
            await this.outputPort.presentError(err instanceof Error ? err : new Error(String(err)));
        }
        
        await this.outputPort.presentLoading(false);
    }

    private async rollbackCreate(ctx: CreateRollbackContext): Promise<void> {
        for (const image of ctx.createdImages) {
            await this.filesRepository.delete(image.id);
        }
    }
}

export interface CreateItemOutputPort {
    presentLoading(isLoading: boolean): Promise<void>;
    presentCreated(id: string): Promise<void>;
    presentError(error: Error): Promise<void>;
}
