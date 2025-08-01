import type { ItemRepositoryDto } from "../../../adapters/gateways/repositories/items/ItemRepositoryDto";
import type { ItemsRepositoryAdapter } from "../../../adapters/gateways/repositories/items/ItemsRepository";
import { FirebaseRepository } from "./FirebaseRepository";

export class FirebaseItemsRepository
  extends FirebaseRepository<ItemRepositoryDto>
  implements ItemsRepositoryAdapter {
  protected getCollectionPath(): string {
    return "items";
  }
}
