import rawView from './lock-screen.view.json';
import type { LockScreenContentProvider } from '../application/contracts/lockScreen.contracts';
import type { LockScreenViewDto } from '../application/dtos/lockScreen.dto';
import { mapLockScreenViewDto } from './mappers/mapLockScreenViewDto';
export class JsonLockScreenContentProvider implements LockScreenContentProvider { private readonly view: LockScreenViewDto; constructor() { this.view = mapLockScreenViewDto(rawView); } getView() { return this.view; } }
