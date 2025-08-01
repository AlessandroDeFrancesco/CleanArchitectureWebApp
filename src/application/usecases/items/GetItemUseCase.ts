import type { UseCase } from "../UseCase";
import { isOk } from "../../../utils/Result";
import type { ItemsRepositoryService } from "../../services/repositories/ItemsRepositoryService";
import type { ItemEntity } from "../../../domain/entities/ItemEntity";

export interface GetItemUseCaseInputPort extends UseCase {
    get(request: GetItemRequest): Promise<void>;
}

export type GetItemRequest = {
    id: string;
}

export class GetItemUseCase implements GetItemUseCaseInputPort {
    private repository: ItemsRepositoryService;
    private outputPort: GetItemOutputPort;

    constructor(repository: ItemsRepositoryService, outputPort: GetItemOutputPort) {
        this.repository = repository;
        this.outputPort = outputPort;
    }

    async get(request: GetItemRequest): Promise<void> {
        await this.outputPort.presentLoading(true);
        const result = await this.repository.get(request.id);
        if (isOk(result)) {
            await this.outputPort.presentItem(result.value);
        } else {
            await this.outputPort.presentError(result.error);
        }
        await this.outputPort.presentLoading(false);
    }
}

export interface GetItemOutputPort {
    presentLoading(isLoading: boolean): Promise<void>;
    presentItem(item: ItemEntity): Promise<void>;
    presentError(error: Error): Promise<void>;
}
