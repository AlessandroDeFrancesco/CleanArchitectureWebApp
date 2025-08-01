import type { SignInController } from "../adapters/controllers/SignInController";
import type { MainController } from "../adapters/controllers/MainController";
import type { RouterService } from "../application/services/RouterService";
import type { FilesRepository, FilesRepositoryAdapter } from "../adapters/gateways/repositories/files/FilesRepository";
import type { SignInPresenter } from "../adapters/presenters/SignInPresenter";
import type { MainPresenter } from "../adapters/presenters/MainPresenter";
import type { SignInUseCaseInputPort } from "../application/usecases/auth/SignInUseCase";
import type { AuthService } from "../application/services/AuthService";
import type { Cache } from "../frameworks/cache/Cache";
import type { OptionsController } from "../adapters/controllers/OptionsController";
import type { SignOutPresenter } from "../adapters/presenters/SignOutPresenter";
import type { CreateItemUseCaseInputPort } from "../application/usecases/items/CreateItemUseCase";
import type { DeleteItemUseCaseInputPort } from "../application/usecases/items/DeleteItemUseCase";
import type { GetItemUseCaseInputPort } from "../application/usecases/items/GetItemUseCase";
import type { ListItemsUseCaseInputPort } from "../application/usecases/items/ListItemsUseCase";
import type { UpdateItemUseCaseInputPort } from "../application/usecases/items/UpdateItemUseCase";
import type { ItemsRepositoryAdapter, ItemsRepository } from "../adapters/gateways/repositories/items/ItemsRepository";


export interface DependenciesContainer {
  cache: Cache;

  authService: AuthService;
  routerService: RouterService;

  itemsRepositoryAdapter: ItemsRepositoryAdapter;
  filesRepositoryAdapter: FilesRepositoryAdapter;

  itemsRepository: ItemsRepository;
  filesRepository: FilesRepository;

  signInPresenter: SignInPresenter;
  signOutPresenter: SignOutPresenter;
  mainPresenter: MainPresenter;

  signInController: SignInController;
  mainController: MainController;
  optionsController: OptionsController;

  createSignInUseCase(): SignInUseCaseInputPort;
  createListItemsUseCase(): ListItemsUseCaseInputPort;
  createGetItemUseCase(): GetItemUseCaseInputPort;
  createCreateItemUseCase(): CreateItemUseCaseInputPort;
  createUpdateItemUseCase(): UpdateItemUseCaseInputPort;
  createDeleteItemUseCase(): DeleteItemUseCaseInputPort;
}

export let dependencies: DependenciesContainer;
export function setDependenciesImplementation(implementation: DependenciesContainer) {
  dependencies = implementation;
}