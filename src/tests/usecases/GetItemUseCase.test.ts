import { describe, it, beforeEach } from 'vitest'
import { mock, instance, when, verify, deepEqual } from 'ts-mockito'
import type { ItemsRepositoryService } from '../../application/services/repositories/ItemsRepositoryService'
import { type GetItemOutputPort, GetItemUseCase, type GetItemRequest } from '../../application/usecases/items/GetItemUseCase'
import type { ItemEntity } from '../../domain/entities/ItemEntity'

describe('GetItemUseCase', () => {
  let itemsRepoMock: ItemsRepositoryService
  let outputPortMock: GetItemOutputPort

  let itemsRepo: ItemsRepositoryService
  let outputPort: GetItemOutputPort

  let useCase: GetItemUseCase

  const request: GetItemRequest = { id: 'item123' }

  const item: ItemEntity = {
    id: 'item123',
    name: 'Test Item',
    description: 'Description',
    imageIds: ['img1', 'img2'],
    createdAt: new Date(),
    modifiedAt: new Date()
  }

  beforeEach(() => {
    itemsRepoMock = mock<ItemsRepositoryService>()
    outputPortMock = mock<GetItemOutputPort>()

    itemsRepo = instance(itemsRepoMock)
    outputPort = instance(outputPortMock)

    useCase = new GetItemUseCase(itemsRepo, outputPort)
  })

  it('presents item when found', async () => {
    when(itemsRepoMock.get(request.id)).thenResolve({ type: 'ok', value: item })

    await useCase.get(request)

    verify(outputPortMock.presentLoading(true)).once()
    verify(itemsRepoMock.get(request.id)).once()
    verify(outputPortMock.presentLoading(false)).once()
    verify(outputPortMock.presentItem(deepEqual(item))).once()
    verify(outputPortMock.presentError(deepEqual(new Error()))).never()
  })

  it('presents error when item not found', async () => {
    const error = new Error('NotFound')
    when(itemsRepoMock.get(request.id)).thenResolve({ type: 'error', error })

    await useCase.get(request)

    verify(outputPortMock.presentLoading(true)).once()
    verify(itemsRepoMock.get(request.id)).once()
    verify(outputPortMock.presentLoading(false)).once()
    verify(outputPortMock.presentError(deepEqual(error))).once()
    verify(outputPortMock.presentItem(deepEqual(item))).never()
  })
})
