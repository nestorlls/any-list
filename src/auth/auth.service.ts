import { BadRequestException, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput, RegisterInput } from './dto/input';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    const user = await this.usersService.create(registerInput);
    const token = 'token';
    return { token, user };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    const user = await this.usersService.findOneByEmail(email);
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }
    const token = 'token';
    return { token, user };
  }
}
