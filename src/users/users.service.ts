import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { RegisterInput } from 'src/auth/dto/input/register.input';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(registerInput: RegisterInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...registerInput,
        password: bcrypt.hashSync(registerInput.password, 10),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOne(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async block(id: string): Promise<boolean> {
    return true;
  }

  private handleError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException();
  }
}
