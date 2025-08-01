import { describe, it } from 'vitest';
import { mock, instance, when, verify } from 'ts-mockito';
import type { AuthService } from '../../application/services/AuthService';
import { type SignOutUseCaseOutputPort, SignOutUseCase } from '../../application/usecases/auth/SignOutUseCase';
import { createResult, createError } from '../../utils/Result';

describe('SignOutUseCase', () => {
  it('calls presentSuccess when signOut succeeds', async () => {
    const authServiceMock = mock<AuthService>();
    const outputPortMock = mock<SignOutUseCaseOutputPort>();

    when(authServiceMock.signOut()).thenResolve(createResult<void, 'Other'>(undefined));

    const useCase = new SignOutUseCase(instance(authServiceMock), instance(outputPortMock));

    await useCase.signOut();

    verify(outputPortMock.presentLoading(true)).once();
    verify(authServiceMock.signOut()).once();
    verify(outputPortMock.presentLoading(false)).once();
    verify(outputPortMock.presentSuccess()).once();
    verify(outputPortMock.presentSignOutError('Other')).never();
  });

  it('calls presentSignOutError when signOut fails', async () => {
    const authServiceMock = mock<AuthService>();
    const outputPortMock = mock<SignOutUseCaseOutputPort>();

    when(authServiceMock.signOut()).thenResolve(createError<void, 'Other'>('Other'));

    const useCase = new SignOutUseCase(instance(authServiceMock), instance(outputPortMock));

    await useCase.signOut();

    verify(outputPortMock.presentLoading(true)).once();
    verify(authServiceMock.signOut()).once();
    verify(outputPortMock.presentLoading(false)).once();
    verify(outputPortMock.presentSignOutError('Other')).once();
    verify(outputPortMock.presentSuccess()).never();
  });
});
