import type { SignUpGateway } from '@/features/authentication/sign-up/application/contracts/signUp.contracts';
import type {
  SignUpCommandDto,
  SignUpResultDto,
} from '@/features/authentication/sign-up/application/dtos/signUp.dto';

export type MockSignUpMode = 'success' | 'unavailable';

export class MockSignUpGateway implements SignUpGateway {
  constructor(private readonly mode: MockSignUpMode = 'success') {}

  async createAccount(command: SignUpCommandDto): Promise<SignUpResultDto> {
    void command;

    if (this.mode === 'unavailable') {
      return { status: 'failure', reason: 'unavailable' };
    }

    return { status: 'success' };
  }
}
