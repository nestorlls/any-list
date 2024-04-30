import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput, RegisterInput } from './dto/input';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    const user = await this.usersService.create(registerInput);
    const token = this.getJwtToken(user.id);
    return { token, user };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    const user = await this.usersService.findOneByEmail(email);
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }
    const token = this.getJwtToken(user.id);
    return { token, user };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);
    if (!user.isActive)
      throw new UnauthorizedException(
        'User is not active, try again or contact with an admin',
      );
    delete user.password;
    return user;
  }

  private getJwtToken(userId: string): string {
    return this.jwtService.sign({ id: userId });
  }
}
