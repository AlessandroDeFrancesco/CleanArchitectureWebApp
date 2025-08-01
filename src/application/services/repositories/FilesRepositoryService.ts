import type { FileEntity } from "../../../domain/entities/FileEntity";
import type { RepositoryService } from "./RepositoryService";

export interface FilesRepositoryService extends RepositoryService<FileEntity> { }
