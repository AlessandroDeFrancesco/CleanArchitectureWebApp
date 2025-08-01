import type { UseCase } from "../UseCase";
import { isOk } from "../../../utils/Result";
import type { ItemsRepositoryService } from "../../services/repositories/ItemsRepositoryService";
import type { ItemEntity } from "../../../domain/entities/ItemEntity";
import { Logger } from "../../../utils/Logger";

export interface ListItemsUseCaseInputPort extends UseCase {
    listAll(): Promise<void>;
}

export class ListItemsUseCase implements ListItemsUseCaseInputPort {
    private repository: ItemsRepositoryService;
    private outputPort: ListItemsOutputPort;

    constructor(repository: ItemsRepositoryService, outputPort: ListItemsOutputPort) {
        this.repository = repository;
        this.outputPort = outputPort;
    }

    async listAll(): Promise<void> {
        Logger.log("list all");
        await this.outputPort.presentLoading(true);
        const result = await this.repository.getAll();
        if (isOk(result)) {
            await this.outputPort.presentItems(result.value);
        } else {
            await this.outputPort.presentError(result.error);
        }
        await this.outputPort.presentLoading(false);
    }
}

export interface ListItemsOutputPort {
    presentLoading(isLoading: boolean): Promise<void>;
    presentItems(items: ItemEntity[]): Promise<void>;
    presentError(error: Error): Promise<void>;
}
