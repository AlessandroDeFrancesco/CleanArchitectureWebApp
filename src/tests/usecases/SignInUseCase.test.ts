import { describe, it, beforeEach } from 'vitest'
import { mock, instance, when, verify, deepEqual } from 'ts-mockito'
import type { AuthService, AuthUser } from '../../application/services/AuthService'
import { type SignInUseCaseOutputPort, SignInUseCase } from '../../application/usecases/auth/SignInUseCase'

describe('SignInUseCase', () => {
  let authServiceMock: AuthService
  let authService: AuthService
  let outputPortMock: SignInUseCaseOutputPort
  let outputPort: SignInUseCaseOutputPort
  let useCase: SignInUseCase

  const request = { email: 'user@example.com', password: 'password' }

  beforeEach(() => {
    authServiceMock = mock<AuthService>()
    outputPortMock = mock<SignInUseCaseOutputPort>()

    authService = instance(authServiceMock)
    outputPort = instance(outputPortMock)

    useCase = new SignInUseCase(authService, outputPort)
  })

  it('shows loading and success if signIn and getUser succeed', async () => {
    const user: AuthUser = { id: 'abc123', displayName: 'John Doe' }

    when(authServiceMock.signIn(request.email, request.password)).thenResolve({ type: 'ok', value: undefined })
    when(authServiceMock.getUser()).thenResolve({ type: 'ok', value: user })

    await useCase.signIn(request)

    verify(outputPortMock.presentLoading(true)).once()
    verify(outputPortMock.presentLoading(false)).once()
    verify(outputPortMock.presentSuccess(deepEqual({ id: 'abc123', name: 'John Doe' }))).once()
  })

  it('shows error if signIn fails', async () => {
    when(authServiceMock.signIn(request.email, request.password)).thenResolve({
      type: 'error',
      error: 'InvalidCrendentials'
    })

    await useCase.signIn(request)

    verify(outputPortMock.presentLoading(true)).once()
    verify(outputPortMock.presentLoading(false)).once()
    verify(outputPortMock.presentSignInError('InvalidCrendentials')).once()
  })

  it('shows error if getUser fails', async () => {
    when(authServiceMock.signIn(request.email, request.password)).thenResolve({ type: 'ok', value: undefined })
    when(authServiceMock.getUser()).thenResolve({ type: 'error', error: 'NotLoggedIn' })

    await useCase.signIn(request)

    verify(outputPortMock.presentLoading(true)).once()
    verify(outputPortMock.presentLoading(false)).once()
    verify(outputPortMock.presentSignInError('NotLoggedIn')).once()
  })
})
