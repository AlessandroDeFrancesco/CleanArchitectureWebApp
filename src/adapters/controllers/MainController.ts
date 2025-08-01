import type { CreateItemUseCaseInputPort } from "../../application/usecases/items/CreateItemUseCase";
import type { DeleteItemUseCaseInputPort } from "../../application/usecases/items/DeleteItemUseCase";
import type { GetItemUseCaseInputPort } from "../../application/usecases/items/GetItemUseCase";
import type { ListItemsUseCaseInputPort } from "../../application/usecases/items/ListItemsUseCase";
import type { UpdateItemUseCaseInputPort } from "../../application/usecases/items/UpdateItemUseCase";
import type { ItemPresenterDto } from "../presenters/dtos/ItemPresenterDto";
import type { Controller } from "./Controller";


export class MainController implements Controller {
    private readonly listUseCase: ListItemsUseCaseInputPort;
    private readonly getUseCase: GetItemUseCaseInputPort;
    private readonly createUseCase: CreateItemUseCaseInputPort;
    private readonly updateUseCase: UpdateItemUseCaseInputPort;
    private readonly deleteUseCase: DeleteItemUseCaseInputPort;

    constructor(
        listUseCase: ListItemsUseCaseInputPort,
        getUseCase: GetItemUseCaseInputPort,
        createUseCase: CreateItemUseCaseInputPort,
        updateUseCase: UpdateItemUseCaseInputPort,
        deleteUseCase: DeleteItemUseCaseInputPort,
    ) {
        this.listUseCase = listUseCase;
        this.getUseCase = getUseCase;
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.deleteUseCase = deleteUseCase;

        this.loadAll();
    }


    async loadAll(): Promise<void> {
        await this.listUseCase.listAll();
    }

    async loadOne(id: string): Promise<void> {
        await this.getUseCase.get({ id });
    }

    async createItem(data: ItemPresenterDto): Promise<void> {
        const request = {
            name: data.name,
            description: data.description,
            images: data.images
        };
        await this.createUseCase.create(request);
        await this.loadAll();
    }

    async updateItem(data: ItemPresenterDto): Promise<void> {
        const request = {
            id: data.id,
            name: data.name,
            description: data.description,
            images: data.images
        };
        await this.updateUseCase.update(request);
        await this.loadAll();
    }

    async deleteItem(id: string): Promise<void> {
        await this.deleteUseCase.delete({ id });
        await this.loadAll();
    }
}
