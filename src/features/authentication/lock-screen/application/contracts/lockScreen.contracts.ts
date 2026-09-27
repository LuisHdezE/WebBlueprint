import type { LockScreenCommandDto, LockScreenResultDto, LockScreenViewDto } from '../dtos/lockScreen.dto';
export interface LockScreenContentProvider { getView(): LockScreenViewDto; }
export interface LockScreenGateway { unlock(command: LockScreenCommandDto): Promise<LockScreenResultDto>; }
