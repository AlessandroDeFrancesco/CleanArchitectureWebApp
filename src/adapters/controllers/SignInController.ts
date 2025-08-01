import type { SignInUseCaseInputPort } from "../../application/usecases/auth/SignInUseCase";
import type { Controller } from "./Controller";

export class SignInController implements Controller {
    private readonly signInUseCase: SignInUseCaseInputPort;


    constructor(signInUseCase: SignInUseCaseInputPort) {
        this.signInUseCase = signInUseCase;
    }

    async signIn(email: string, password: string): Promise<void> {
        await this.signInUseCase.signIn({
            email,
            password
        });
    }
}

