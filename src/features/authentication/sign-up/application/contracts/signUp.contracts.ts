import type {
  SignUpCommandDto,
  SignUpResultDto,
  SignUpViewDto,
} from '@/features/authentication/sign-up/application/dtos/signUp.dto';

export interface SignUpContentProvider {
  getView(): SignUpViewDto;
}

export interface SignUpGateway {
  createAccount(command: SignUpCommandDto): Promise<SignUpResultDto>;
}
