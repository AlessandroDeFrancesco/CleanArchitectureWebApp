import type { RouterService } from "../../application/services/RouterService";
import type { SignInUseCaseOutputPort } from "../../application/usecases/auth/SignInUseCase";
import { createMutableObservable, createMutableObservableEvent, getObservable, getObservableEvent } from "../../utils/Observable";
import type { Presenter } from "./Presenter";

export class SignInPresenter implements Presenter, SignInUseCaseOutputPort {
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
        this.router.goTo("main");
    }

    async presentSignInError(error: "InvalidCrendentials" | "Other"): Promise<void> {
        if (error === "InvalidCrendentials") {
            this.errorEvent.emit("Wrong email or password");
        } else {
            this.errorEvent.emit("Unknown error, try again");
        }
    }
}


