import { describe, it, beforeEach } from 'vitest'
import { mock, instance, when, verify, deepEqual } from 'ts-mockito'
import type { ItemsRepositoryService } from '../../application/services/repositories/ItemsRepositoryService'
import { type ListItemsOutputPort, ListItemsUseCase } from '../../application/usecases/items/ListItemsUseCase'
import type { ItemEntity } from '../../domain/entities/ItemEntity'

describe('ListItemsUseCase', () => {
  let itemsRepoMock: ItemsRepositoryService
  let outputPortMock: ListItemsOutputPort

  let itemsRepo: ItemsRepositoryService
  let outputPort: ListItemsOutputPort

  let useCase: ListItemsUseCase

  const items: ItemEntity[] = [
    {
      id: 'item1',
      name: 'Item One',
      description: 'Desc One',
      imageIds: ['img1'],
      createdAt: new Date(),
      modifiedAt: new Date()
    },
    {
      id: 'item2',
      name: 'Item Two',
      description: 'Desc Two',
      imageIds: ['img2', 'img3'],
      createdAt: new Date(),
      modifiedAt: new Date()
    }
  ]

  beforeEach(() => {
    itemsRepoMock = mock<ItemsRepositoryService>()
    outputPortMock = mock<ListItemsOutputPort>()

    itemsRepo = instance(itemsRepoMock)
    outputPort = instance(outputPortMock)

    useCase = new ListItemsUseCase(itemsRepo, outputPort)
  })

  it('presents items when getAll succeeds', async () => {
    when(itemsRepoMock.getAll()).thenResolve({ type: 'ok', value: items })

    await useCase.listAll()

    verify(outputPortMock.presentLoading(true)).once()
    verify(itemsRepoMock.getAll()).once()
    verify(outputPortMock.presentLoading(false)).once()
    verify(outputPortMock.presentItems(deepEqual(items))).once()
    verify(outputPortMock.presentError(deepEqual(new Error()))).never()
  })

  it('presents error when getAll fails', async () => {
    const error = new Error('DatabaseError')
    when(itemsRepoMock.getAll()).thenResolve({ type: 'error', error })

    await useCase.listAll()

    verify(outputPortMock.presentLoading(true)).once()
    verify(itemsRepoMock.getAll()).once()
    verify(outputPortMock.presentLoading(false)).once()
    verify(outputPortMock.presentError(deepEqual(error))).once()
    verify(outputPortMock.presentItems(deepEqual(items))).never()
  })
})
