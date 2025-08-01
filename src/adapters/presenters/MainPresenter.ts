import type { ItemEntity } from "../../domain/entities/ItemEntity";
import {
    createMutableObservable, getObservable,
    createMutableObservableEvent, getObservableEvent,
} from "../../utils/Observable";
import { isOk } from "../../utils/Result";
import type { Presenter } from "./Presenter";
import type { CreateItemOutputPort } from "../../application/usecases/items/CreateItemUseCase";
import type { DeleteItemOutputPort } from "../../application/usecases/items/DeleteItemUseCase";
import type { GetItemOutputPort } from "../../application/usecases/items/GetItemUseCase";
import type { ListItemsOutputPort } from "../../application/usecases/items/ListItemsUseCase";
import type { UpdateItemOutputPort } from "../../application/usecases/items/UpdateItemUseCase";
import type { FilesRepository } from "../gateways/repositories/files/FilesRepository";
import type { ItemPresenterDto, ImagePresenterDto } from "./dtos/ItemPresenterDto";

export class MainPresenter
    implements
    Presenter,
    ListItemsOutputPort,
    GetItemOutputPort,
    CreateItemOutputPort,
    UpdateItemOutputPort,
    DeleteItemOutputPort {

    // Observables
    private readonly isLoading = createMutableObservable<boolean>(false);
    readonly IsLoading = getObservable(this.isLoading);

    private readonly items = createMutableObservable<ItemPresenterDto[]>([]);
    readonly Items = getObservable(this.items);

    private readonly currentItem = createMutableObservable<ItemPresenterDto | null>(null);
    readonly CurrentItem = getObservable(this.currentItem);

    private readonly errorEvent = createMutableObservableEvent<string>();
    readonly ErrorEvent = getObservableEvent(this.errorEvent);

    private readonly createdIdEvent = createMutableObservableEvent<string>();
    readonly CreatedIdEvent = getObservableEvent(this.createdIdEvent);

    private readonly updatedIdEvent = createMutableObservableEvent<string>();
    readonly UpdatedIdEvent = getObservableEvent(this.updatedIdEvent);

    private readonly deletedIdEvent = createMutableObservableEvent<string>();
    readonly DeletedIdEvent = getObservableEvent(this.deletedIdEvent);

    private readonly filesRepository: FilesRepository;

    constructor(filesRepository: FilesRepository) {
        this.filesRepository = filesRepository;
    }

    async presentLoading(isLoading: boolean): Promise<void> {
        this.isLoading.value = isLoading;
    }

    async presentItems(items: ItemEntity[]): Promise<void> {
        const itemsPresentable: ItemPresenterDto[] = [];
        for (const item of items) {
            const itemPresentable = await toItemPresenterDto(item, this.filesRepository);
            itemsPresentable.push(itemPresentable);
        }

        this.items.value = itemsPresentable;
    }

    async presentItem(item: ItemEntity): Promise<void> {
        this.currentItem.value = await toItemPresenterDto(item, this.filesRepository);
    }

    async presentCreated(id: string): Promise<void> {
        this.createdIdEvent.emit(id);
    }

    async presentUpdated(id: string): Promise<void> {
        this.updatedIdEvent.emit(id);
    }

    async presentDeleted(id: string): Promise<void> {
        this.deletedIdEvent.emit(id);
    }

    async presentError(error: Error): Promise<void> {
        this.errorEvent.emit(error.message);
    }
}


async function toItemPresenterDto(item: ItemEntity, filesRepository: FilesRepository) {
    const images: ImagePresenterDto[] = [];
    for (const imageId of item.imageIds) {
        const result = await filesRepository.get(imageId);
        if (isOk(result)) {
            images.push({
                ...result.value,
                contentBase64: result.value.content
            });
        }
    }
    const itemPresentable = {
        ...item,
        images: images
    };
    return itemPresentable;
}