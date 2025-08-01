import type { AuthService } from "../../services/AuthService";
import { isOk } from "../../../utils/Result";
import type { UseCase } from "../UseCase";
import type { UserEntity } from "../../../domain/entities/UserEntity";

export interface SignInUseCaseInputPort extends UseCase {
    signIn(request: SignInRequest): Promise<void>;
}

export type SignInRequest = {
    email: string;
    password: string;
}

export class SignInUseCase implements SignInUseCaseInputPort {
    private authService: AuthService;
    private outputPort: SignInUseCaseOutputPort;

    constructor(authController: AuthService, outputPort: SignInUseCaseOutputPort) {
        this.authService = authController;
        this.outputPort = outputPort;
    }

    async signIn(request: SignInRequest): Promise<void> {
        await this.outputPort.presentLoading(true);
        var signInResult = await this.authService.signIn(request.email, request.password);
        var getUserResult = await this.authService.getUser();
        await this.outputPort.presentLoading(false);
        if (!isOk(signInResult)) {
            await this.outputPort.presentSignInError(signInResult.error);
        } else if (!isOk(getUserResult)) {
            await this.outputPort.presentSignInError(getUserResult.error);
        } else {
            const user = {
                id: getUserResult.value.id,
                name: getUserResult.value.displayName ?? "unknown"
            }
            await this.outputPort.presentSuccess(user);
        }
    }
}

export interface SignInUseCaseOutputPort {
    presentLoading(isLoading: boolean): Promise<void>;
    presentSuccess(user: UserEntity): Promise<void>;
    presentSignInError(error: "InvalidCrendentials" | "Other" | "NotLoggedIn"): Promise<void>;
}