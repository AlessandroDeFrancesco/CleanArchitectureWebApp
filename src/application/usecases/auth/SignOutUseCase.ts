import type { AuthService } from "../../services/AuthService";
import { isOk } from "../../../utils/Result";
import type { UseCase } from "../UseCase";

export interface SignOutUseCaseInputPort extends UseCase {
    signOut(): Promise<void>;
}

export class SignOutUseCase implements SignOutUseCaseInputPort {
    private authService: AuthService;
    private outputPort: SignOutUseCaseOutputPort;

    constructor(authController: AuthService, outputPort: SignOutUseCaseOutputPort) {
        this.authService = authController;
        this.outputPort = outputPort;
    }

    async signOut(): Promise<void> {
        await this.outputPort.presentLoading(true);
        var signOutResult = await this.authService.signOut();
        await this.outputPort.presentLoading(false);
        if (!isOk(signOutResult)) {
            await this.outputPort.presentSignOutError(signOutResult.error);
        } else {
            await this.outputPort.presentSuccess();
        }
    }
}

export interface SignOutUseCaseOutputPort {
    presentLoading(isLoading: boolean): Promise<void>;
    presentSuccess(): Promise<void>;
    presentSignOutError(error: "Other"): Promise<void>;
}