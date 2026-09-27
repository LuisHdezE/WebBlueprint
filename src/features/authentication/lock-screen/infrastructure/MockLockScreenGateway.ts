import type { LockScreenGateway } from '../application/contracts/lockScreen.contracts';
import type { LockScreenCommandDto, LockScreenFailureReasonDto, LockScreenResultDto } from '../application/dtos/lockScreen.dto';
export type MockLockScreenMode = 'success' | LockScreenFailureReasonDto;
export class MockLockScreenGateway implements LockScreenGateway {
  constructor(private readonly mode: MockLockScreenMode = 'success', private readonly delayMs = 350) {}
  async unlock(command: LockScreenCommandDto): Promise<LockScreenResultDto> { void command; await new Promise<void>((resolve) => setTimeout(resolve, this.delayMs)); return this.mode === 'success' ? { status: 'success' } : { status: 'failure', reason: this.mode }; }
}
