import type { SignOutUseCaseInputPort } from "../../application/usecases/auth/SignOutUseCase";
import type { Controller } from "./Controller";


export class OptionsController implements Controller {
    private readonly signOutUseCase: SignOutUseCaseInputPort;


    constructor(signOutUseCase: SignOutUseCaseInputPort) {
        this.signOutUseCase = signOutUseCase;
    }

    async signOut(): Promise<void> {
        await this.signOutUseCase.signOut();
    }
}
