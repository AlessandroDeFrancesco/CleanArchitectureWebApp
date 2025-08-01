import { describe, it, beforeEach } from 'vitest'
import { mock, instance, when, verify, deepEqual, resetCalls, anything } from 'ts-mockito'
import type { ItemsRepositoryService } from '../../application/services/repositories/ItemsRepositoryService'
import type { FilesRepositoryService } from '../../application/services/repositories/FilesRepositoryService'
import type { UpdateItemOutputPort, UpdateItemRequest } from '../../application/usecases/items/UpdateItemUseCase'
import { UpdateItemUseCase } from '../../application/usecases/items/UpdateItemUseCase'
import type { ItemEntity } from '../../domain/entities/ItemEntity'
import type { FileEntity } from '../../domain/entities/FileEntity'

describe('UpdateItemUseCase', () => {
  let itemsRepoMock: ItemsRepositoryService
  let filesRepoMock: FilesRepositoryService
  let outputPortMock: UpdateItemOutputPort

  let itemsRepo: ItemsRepositoryService
  let filesRepo: FilesRepositoryService
  let outputPort: UpdateItemOutputPort

  let useCase: UpdateItemUseCase

  const itemId = 'item123'
  const previousItem: ItemEntity = {
    id: itemId,
    name: 'Old Name',
    description: 'Old Desc',
    imageIds: ['img1', 'img2'],
    createdAt: new Date(),
    modifiedAt: new Date()
  }

  const existingFiles: FileEntity[] = [
    { id: 'img1', name: 'img1.jpg', content: 'base64-1', mimeType: 'image/jpeg', createdAt: new Date() },
    { id: 'img2', name: 'img2.jpg', content: 'base64-2', mimeType: 'image/jpeg', createdAt: new Date() }
  ]

  beforeEach(() => {
    itemsRepoMock = mock<ItemsRepositoryService>()
    filesRepoMock = mock<FilesRepositoryService>()
    outputPortMock = mock<UpdateItemOutputPort>()

    itemsRepo = instance(itemsRepoMock)
    filesRepo = instance(filesRepoMock)
    outputPort = instance(outputPortMock)

    useCase = new UpdateItemUseCase(itemsRepo, filesRepo, outputPort)

    resetCalls(itemsRepoMock)
    resetCalls(filesRepoMock)
    resetCalls(outputPortMock)
  })

  it('updates item successfully with image sync', async () => {
    const request: UpdateItemRequest = {
      id: itemId,
      name: 'New Name',
      description: 'New Description',
      images: [
        { id: 'img1', name: 'img1.jpg', mimeType: 'image/jpeg', contentBase64: 'base64-1-new' },
        { name: 'img3.jpg', mimeType: 'image/jpeg', contentBase64: 'base64-3' }
      ]
    }

    when(itemsRepoMock.get(itemId)).thenResolve({ type: 'ok', value: previousItem })

    when(filesRepoMock.get('img1')).thenResolve({ type: 'ok', value: existingFiles[0] })
    when(filesRepoMock.get('img2')).thenResolve({ type: 'ok', value: existingFiles[1] })

    when(filesRepoMock.create(deepEqual({
      name: 'img3.jpg',
      content: 'base64-3',
      mimeType: 'image/jpeg',
      createdAt: anything()
    }))).thenResolve({ type: 'ok', value: 'img3' })

    when(filesRepoMock.delete('img2')).thenResolve({ type: 'ok', value: 'img2' })

    when(itemsRepoMock.update(deepEqual({
      id: itemId,
      name: 'New Name',
      description: 'New Description',
      modifiedAt: anything(),
      imageIds: ['img1', 'img3']
    }))).thenResolve({ type: 'ok', value: itemId })

    when(outputPortMock.presentLoading(true)).thenResolve()
    when(outputPortMock.presentLoading(false)).thenResolve()
    when(outputPortMock.presentUpdated(itemId)).thenResolve()

    await useCase.update(request)

    verify(outputPortMock.presentLoading(true)).once()
    verify(itemsRepoMock.get(itemId)).once()
    verify(filesRepoMock.get('img1')).once()
    verify(filesRepoMock.get('img2')).once()
    verify(filesRepoMock.create(deepEqual({
      name: 'img3.jpg',
      content: 'base64-3',
      mimeType: 'image/jpeg',
      createdAt: anything(),
    }))).once()
    verify(filesRepoMock.delete('img2')).once()
    verify(itemsRepoMock.update(deepEqual({
      id: itemId,
      name: 'New Name',
      description: 'New Description',
      modifiedAt: anything(),
      imageIds: ['img1', 'img3']
    }))).once()
    verify(outputPortMock.presentLoading(false)).once()
    verify(outputPortMock.presentUpdated(itemId)).once()
  })

  it('presents error if previous item fetch fails', async () => {
    const request: UpdateItemRequest = { id: itemId }

    const error = new Error(`Nothing to update with id ${request.id}`)
    when(itemsRepoMock.get(itemId)).thenResolve({ type: 'error', error })

    when(outputPortMock.presentLoading(true)).thenResolve()
    when(outputPortMock.presentLoading(false)).thenResolve()
    when(outputPortMock.presentError(deepEqual(error))).thenResolve()

    await useCase.update(request)

    verify(outputPortMock.presentLoading(true)).once()
    verify(itemsRepoMock.get(itemId)).once()
    verify(outputPortMock.presentLoading(false)).once()
    verify(outputPortMock.presentError(deepEqual(error))).once()
  })

  it('rollbacks and presents error if image create fails', async () => {
    const request: UpdateItemRequest = {
      id: itemId,
      images: [
        { name: 'img3.jpg', mimeType: 'image/jpeg', contentBase64: 'base64-3' }
      ]
    }

    when(itemsRepoMock.get(itemId)).thenResolve({ type: 'ok', value: previousItem })

    when(filesRepoMock.get('img1')).thenResolve({ type: 'ok', value: existingFiles[0] })
    when(filesRepoMock.get('img2')).thenResolve({ type: 'ok', value: existingFiles[1] })

    const createError = new Error('Create failed')
    when(filesRepoMock.create(anything())).thenResolve({ type: 'error', error: createError })

    when(outputPortMock.presentLoading(true)).thenResolve()
    when(outputPortMock.presentLoading(false)).thenResolve()
    when(outputPortMock.presentError(createError)).thenResolve()

    when(itemsRepoMock.update(previousItem)).thenResolve({ type: 'ok', value: previousItem.id })

    await useCase.update(request)

    verify(outputPortMock.presentLoading(true)).once()
    verify(itemsRepoMock.get(itemId)).once()
    verify(filesRepoMock.get('img1')).once()
    verify(filesRepoMock.get('img2')).once()
    verify(filesRepoMock.create(deepEqual({
      name: 'img3.jpg',
      content: 'base64-3',
      mimeType: 'image/jpeg',
      createdAt: anything()
    }))).once()
    verify(itemsRepoMock.update(previousItem)).once()
    verify(outputPortMock.presentLoading(false)).once()
    verify(outputPortMock.presentError(createError)).once()
  })
})
