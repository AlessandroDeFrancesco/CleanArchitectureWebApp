import type { FileRepositoryDto } from "../../../adapters/gateways/repositories/files/FileRepositoryDto";
import type { FilesRepositoryAdapter } from "../../../adapters/gateways/repositories/files/FilesRepository";
import { FirebaseRepository } from "./FirebaseRepository";

export class FirebaseFilesRepository
  extends FirebaseRepository<FileRepositoryDto>
  implements FilesRepositoryAdapter {
  protected getCollectionPath(): string {
    return "files";
  }
}
