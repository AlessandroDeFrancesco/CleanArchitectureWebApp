import type { DependenciesContainer } from "./DependenciesContainer";
import { SignInController } from "../adapters/controllers/SignInController";
import { MainController } from "../adapters/controllers/MainController";
import { FirebaseAuthAdapter } from "../frameworks/firebase/FirebaseAuthGateway";
import { ReactRouterAdapter } from "../frameworks/react/ReactRouterGateway";
import { SignInPresenter } from "../adapters/presenters/SignInPresenter";
import { MainPresenter } from "../adapters/presenters/MainPresenter";
import { SignInUseCase } from "../application/usecases/auth/SignInUseCase";
import { FirebaseFilesRepository } from "../frameworks/firebase/repositories/FirebaseFilesRepository";
import { FilesRepository } from "../adapters/gateways/repositories/files/FilesRepository";
import { defaultMultiLevelCache } from "../frameworks/cache/MultiLevelCache";
import { OptionsController } from "../adapters/controllers/OptionsController";
import { SignOutUseCase } from "../application/usecases/auth/SignOutUseCase";
import { SignOutPresenter } from "../adapters/presenters/SignOutPresenter";
import { CreateItemUseCase } from "../application/usecases/items/CreateItemUseCase";
import { DeleteItemUseCase } from "../application/usecases/items/DeleteItemUseCase";
import { GetItemUseCase } from "../application/usecases/items/GetItemUseCase";
import { ListItemsUseCase } from "../application/usecases/items/ListItemsUseCase";
import { UpdateItemUseCase } from "../application/usecases/items/UpdateItemUseCase";
import { ItemsRepository } from "../adapters/gateways/repositories/items/ItemsRepository";
import { FirebaseItemsRepository } from "../frameworks/firebase/repositories/FirebaseItemsRepository";

export class DefaultDependenciesContainer implements DependenciesContainer {

  cache = defaultMultiLevelCache;

  authService = new FirebaseAuthAdapter();
  routerService = new ReactRouterAdapter();

  itemsRepositoryAdapter = new FirebaseItemsRepository(this.authService, this.cache);
  filesRepositoryAdapter = new FirebaseFilesRepository(this.authService, this.cache);

  itemsRepository = new ItemsRepository(this.itemsRepositoryAdapter);
  filesRepository = new FilesRepository(this.filesRepositoryAdapter);

  signInPresenter: SignInPresenter = new SignInPresenter(this.routerService);
  signOutPresenter: SignOutPresenter = new SignOutPresenter(this.routerService);
  mainPresenter: MainPresenter = new MainPresenter(this.filesRepository);

  signInController = new SignInController(this.createSignInUseCase());
  mainController = new MainController(this.createListItemsUseCase(), this.createGetItemUseCase(), this.createCreateItemUseCase(), this.createUpdateItemUseCase(), this.createDeleteItemUseCase());
  optionsController = new OptionsController(this.createSignOutUseCase());

  createSignInUseCase() {
    return new SignInUseCase(
      this.authService,
      this.signInPresenter
    );
  }

  createSignOutUseCase() {
    return new SignOutUseCase(
      this.authService,
      this.signOutPresenter
    );
  }

  createListItemsUseCase() {
    return new ListItemsUseCase(
      this.itemsRepository,
      this.mainPresenter
    );
  }

  createGetItemUseCase() {
    return new GetItemUseCase(
      this.itemsRepository,
      this.mainPresenter
    );
  }

  createCreateItemUseCase() {
    return new CreateItemUseCase(
      this.itemsRepository,
      this.filesRepository,
      this.mainPresenter
    );
  }

  createUpdateItemUseCase() {
    return new UpdateItemUseCase(
      this.itemsRepository,
      this.filesRepository,
      this.mainPresenter
    );
  }

  createDeleteItemUseCase() {
    return new DeleteItemUseCase(
      this.itemsRepository,
      this.filesRepository,
      this.mainPresenter
    );
  }
}
