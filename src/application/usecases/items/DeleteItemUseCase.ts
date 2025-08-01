import type { UseCase } from "../UseCase";
import { isOk } from "../../../utils/Result";
import type { ItemsRepositoryService } from "../../services/repositories/ItemsRepositoryService";
import type { FilesRepositoryService } from "../../services/repositories/FilesRepositoryService";

export interface DeleteItemUseCaseInputPort extends UseCase {
    delete(request: DeleteItemRequest): Promise<void>;
}

export type DeleteItemRequest = {
    id: string;
}

export class DeleteItemUseCase implements DeleteItemUseCaseInputPort {
    private itemsRepository: ItemsRepositoryService;
    private filesRepository: FilesRepositoryService;
    private outputPort: DeleteItemOutputPort;

    constructor(repository: ItemsRepositoryService, filesRepository: FilesRepositoryService, outputPort: DeleteItemOutputPort) {
        this.itemsRepository = repository;
        this.filesRepository = filesRepository;
        this.outputPort = outputPort;
    }

    async delete(request: DeleteItemRequest): Promise<void> {
        await this.outputPort.presentLoading(true);
        const itemResult = await this.itemsRepository.get(request.id);
        if (!isOk(itemResult)) {
            await this.outputPort.presentError(itemResult.error);
            return;
        }

        for (const imageId of itemResult.value.imageIds) 
            await this.filesRepository.delete(imageId);
        const result = await this.itemsRepository.delete(request.id);
        
        if (isOk(result)) {
            await this.outputPort.presentDeleted(request.id);
        } else {
            await this.outputPort.presentError(result.error);
        }
        await this.outputPort.presentLoading(false);
    }
}

export interface DeleteItemOutputPort {
    presentLoading(isLoading: boolean): Promise<void>;
    presentDeleted(id: string): Promise<void>;
    presentError(error: Error): Promise<void>;
}
