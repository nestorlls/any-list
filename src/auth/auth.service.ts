import { Injectable } from '@nestjs/common';
import { RegisterInput } from './dto/input/register.input';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    const user = await this.usersService.create(registerInput);
    const token = 'token';
    return { token, user };
  }
}
