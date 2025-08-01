import type { RouterService } from "../../application/services/RouterService";
import type { SignOutUseCaseOutputPort } from "../../application/usecases/auth/SignOutUseCase";
import { createMutableObservable, createMutableObservableEvent, getObservable, getObservableEvent } from "../../utils/Observable";
import type { Presenter } from "./Presenter";

export class SignOutPresenter implements Presenter, SignOutUseCaseOutputPort {
    private readonly isLoading = createMutableObservable<boolean>(false);
    readonly IsLoading = getObservable(this.isLoading);
    private readonly errorEvent = createMutableObservableEvent<string>();
    readonly ErrorEvent = getObservableEvent(this.errorEvent);

    private readonly router: RouterService;


    constructor(router: RouterService) {
        this.router = router;
    }

    async presentLoading(isLoading: boolean): Promise<void> {
        this.isLoading.value = isLoading;
    }

    async presentSuccess(): Promise<void> {
        this.router.goTo("login");
    }

    async presentSignOutError(_error: "Other"): Promise<void> {
        this.errorEvent.emit("Unknown error, try again");
    }
}


