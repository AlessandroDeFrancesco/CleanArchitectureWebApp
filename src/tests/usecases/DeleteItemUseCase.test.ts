import { describe, it, beforeEach } from 'vitest'
import { mock, instance, when, verify, deepEqual } from 'ts-mockito'
import type { FilesRepositoryService } from '../../application/services/repositories/FilesRepositoryService'
import type { ItemsRepositoryService } from '../../application/services/repositories/ItemsRepositoryService'
import { type DeleteItemOutputPort, DeleteItemUseCase, type DeleteItemRequest } from '../../application/usecases/items/DeleteItemUseCase'

describe('DeleteItemUseCase', () => {
  let itemsRepoMock: ItemsRepositoryService
  let filesRepoMock: FilesRepositoryService
  let outputPortMock: DeleteItemOutputPort

  let itemsRepo: ItemsRepositoryService
  let filesRepo: FilesRepositoryService
  let outputPort: DeleteItemOutputPort

  let useCase: DeleteItemUseCase

  const request: DeleteItemRequest = { id: 'item123' }

  beforeEach(() => {
    itemsRepoMock = mock<ItemsRepositoryService>()
    filesRepoMock = mock<FilesRepositoryService>()
    outputPortMock = mock<DeleteItemOutputPort>()

    itemsRepo = instance(itemsRepoMock)
    filesRepo = instance(filesRepoMock)
    outputPort = instance(outputPortMock)

    useCase = new DeleteItemUseCase(itemsRepo, filesRepo, outputPort)
  })

  it('deletes item and its images successfully', async () => {
    when(itemsRepoMock.get(request.id)).thenResolve({
      type: 'ok',
      value: {
        id: request.id,
        name: 'Name',
        description: 'Desc',
        imageIds: ['img1', 'img2'],
        createdAt: new Date(),
        modifiedAt: new Date()
      }
    })

    when(filesRepoMock.delete('img1')).thenResolve()
    when(filesRepoMock.delete('img2')).thenResolve()
    when(itemsRepoMock.delete(request.id)).thenResolve({ type: 'ok', value: 'item123' })

    await useCase.delete(request)

    verify(outputPortMock.presentLoading(true)).once()
    verify(itemsRepoMock.get(request.id)).once()
    verify(filesRepoMock.delete('img1')).once()
    verify(filesRepoMock.delete('img2')).once()
    verify(itemsRepoMock.delete(request.id)).once()
    verify(outputPortMock.presentLoading(false)).once()
    verify(outputPortMock.presentDeleted(request.id)).once()
  })

  it('shows error if get fails', async () => {
    when(itemsRepoMock.get(request.id)).thenResolve({ type: 'error', error: new Error('NotFound') })

    await useCase.delete(request)

    verify(outputPortMock.presentLoading(true)).once()
    verify(outputPortMock.presentError(deepEqual(new Error('NotFound')))).once()
    verify(outputPortMock.presentLoading(false)).never()
  })

  it('shows error if delete fails', async () => {
    when(itemsRepoMock.get(request.id)).thenResolve({
      type: 'ok',
      value: {
        id: request.id,
        name: 'Name',
        description: 'Desc',
        imageIds: ['img1'],
        createdAt: new Date(),
        modifiedAt: new Date()
      }
    })

    when(filesRepoMock.delete('img1')).thenResolve()
    when(itemsRepoMock.delete(request.id)).thenResolve({ type: 'error', error: new Error('DeleteFailed') })

    await useCase.delete(request)

    verify(filesRepoMock.delete('img1')).once()
    verify(outputPortMock.presentError(deepEqual(new Error('DeleteFailed')))).once()
    verify(outputPortMock.presentLoading(false)).once()
  })
})
