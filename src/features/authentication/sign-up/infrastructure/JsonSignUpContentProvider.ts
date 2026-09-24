import rawView from '@/features/authentication/sign-up/infrastructure/sign-up.view.json';
import type { SignUpContentProvider } from '@/features/authentication/sign-up/application/contracts/signUp.contracts';
import type { SignUpViewDto } from '@/features/authentication/sign-up/application/dtos/signUp.dto';
import { mapSignUpViewDto } from '@/features/authentication/sign-up/infrastructure/mappers/mapSignUpViewDto';

export class JsonSignUpContentProvider implements SignUpContentProvider {
  private readonly view: SignUpViewDto;

  constructor() {
    this.view = mapSignUpViewDto(rawView);
  }

  getView(): SignUpViewDto {
    return this.view;
  }
}
