import { describe, it, beforeEach } from 'vitest'
import { mock, instance, when, verify, anything, deepEqual } from 'ts-mockito'
import type { FilesRepositoryService } from '../../application/services/repositories/FilesRepositoryService'
import type { ItemsRepositoryService } from '../../application/services/repositories/ItemsRepositoryService'
import { type CreateItemOutputPort, CreateItemUseCase, type CreateItemRequest } from '../../application/usecases/items/CreateItemUseCase'

describe('CreateItemUseCase', () => {
  let filesRepoMock: FilesRepositoryService
  let itemsRepoMock: ItemsRepositoryService
  let outputPortMock: CreateItemOutputPort

  let filesRepo: FilesRepositoryService
  let itemsRepo: ItemsRepositoryService
  let outputPort: CreateItemOutputPort

  let useCase: CreateItemUseCase

  const request: CreateItemRequest = {
    name: 'Test Item',
    description: 'An item for testing',
    images: [
      {
        name: 'image1.png',
        mimeType: 'image/png',
        contentBase64: 'base64data'
      }
    ]
  }

  beforeEach(() => {
    filesRepoMock = mock<FilesRepositoryService>()
    itemsRepoMock = mock<ItemsRepositoryService>()
    outputPortMock = mock<CreateItemOutputPort>()

    filesRepo = instance(filesRepoMock)
    itemsRepo = instance(itemsRepoMock)
    outputPort = instance(outputPortMock)

    useCase = new CreateItemUseCase(itemsRepo, filesRepo, outputPort)
  })

  it('creates item and images successfully', async () => {
    when(filesRepoMock.create(anything())).thenResolve({ type: 'ok', value: 'file123' })
    when(itemsRepoMock.create(anything())).thenResolve({ type: 'ok', value: 'item123' })

    await useCase.create(request)

    verify(outputPortMock.presentLoading(true)).once()
    verify(filesRepoMock.create(anything())).once()
    verify(itemsRepoMock.create(anything())).once()
    verify(outputPortMock.presentCreated('item123')).once()
    verify(outputPortMock.presentLoading(false)).once()
  })

  it('shows error and rolls back if file creation fails', async () => {
    when(filesRepoMock.create(anything())).thenResolve({ type: 'error', error: new Error('UploadFailed') })

    await useCase.create(request)

    verify(outputPortMock.presentLoading(true)).once()
    verify(outputPortMock.presentError(deepEqual(new Error('UploadFailed')))).once()
    verify(outputPortMock.presentLoading(false)).once()
  })

  it('shows error and rolls back if item creation fails', async () => {
    when(filesRepoMock.create(anything())).thenResolve({ type: 'ok', value: 'file123' })
    when(itemsRepoMock.create(anything())).thenResolve({ type: 'error', error: new Error('CreateFailed') })

    await useCase.create(request)

    verify(filesRepoMock.delete('file123')).once()
    verify(outputPortMock.presentError(deepEqual(new Error('CreateFailed')))).once()
    verify(outputPortMock.presentLoading(false)).once()
  })
})
