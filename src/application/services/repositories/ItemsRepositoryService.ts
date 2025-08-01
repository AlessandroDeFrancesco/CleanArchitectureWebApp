import type { ItemEntity } from "../../../domain/entities/ItemEntity";
import type { RepositoryService } from "./RepositoryService";

export interface ItemsRepositoryService extends RepositoryService<ItemEntity> { }
