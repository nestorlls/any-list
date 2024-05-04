import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { RegisterInput } from 'src/auth/dto/input/register.input';
import { ValidRoles } from 'src/auth/enums/valid-roles.enums';
import { UpdateUserInput } from './dto/inputs/update-user.input';

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

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (!roles.length) return await this.userRepository.find();

    return await this.userRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]', { roles })
      .getMany();
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleError({
        code: 'not_found',
        detail: `User with id '${id}' not found`,
      });
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleError({
        code: 'not_found',
        detail: `User with email '${email}' not found`,
      });
    }
  }

  async update(
    updateUserInput: UpdateUserInput,
    updateBy: User,
  ): Promise<User> {
    const { id } = updateUserInput;
    try {
      const user = await this.userRepository.preload({
        ...updateUserInput,
        lastUpdatedBy: updateBy,
        id,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleError(error);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    try {
      const userFound = await this.findOneById(id);
      userFound.isActive = false;
      userFound.lastUpdatedBy = adminUser;

      return await this.userRepository.save(userFound);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    if (error.code === 'not_found') {
      throw new NotFoundException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException();
  }
}
