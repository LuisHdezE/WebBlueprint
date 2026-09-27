import type { LockScreenContentProvider, LockScreenGateway } from './contracts/lockScreen.contracts';
import type { LockScreenRequestDto, LockScreenSubmissionDto } from './dtos/lockScreen.dto';
export function loadLockScreenView(provider: LockScreenContentProvider) { return provider.getView(); }
export function validateLockScreenRequest(request: LockScreenRequestDto) { return request.password.trim() ? undefined : 'password-required' as const; }
export async function submitLockScreen(gateway: LockScreenGateway, request: LockScreenRequestDto): Promise<LockScreenSubmissionDto> {
  const error = validateLockScreenRequest(request);
  if (error) return { status: 'invalid', error };
  try { return await gateway.unlock({ password: request.password }); } catch { return { status: 'failure', reason: 'unavailable' }; }
}
