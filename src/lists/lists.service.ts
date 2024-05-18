import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { List } from './entities/list.entity';
import { User } from '../users/entities/user.entity';

import { CreateListInput } from './dto/inputs/create-list.input';
import { UpdateListInput } from './dto/inputs/update-list.input';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}
  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const list = this.listRepository.create({ ...createListInput, user });
    return this.listRepository.save(list);
  }

  async findAll(
    paginationAgrs: PaginationArgs,
    searchArgs: SearchArgs,
    user: User,
  ): Promise<List[]> {
    const { limit, offset } = paginationAgrs;
    const { search } = searchArgs;

    const queryBuilder = this.listRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where({ user });

    if (search) {
      queryBuilder.andWhere(`LOWER(name) LIKE LOWER(:name)`, {
        name: `%${search}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = this.listRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });
    if (!list) throw new NotFoundException(`List with id '${id}' not found`);
    return list;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    this.findOne(id, user);
    const list = await this.listRepository.preload({
      ...updateListInput,
      user,
    });
    if (!list) throw new NotFoundException(`List with id '${id}' not found`);
    return this.listRepository.save(list);
  }

  async remove(id: string, user: User): Promise<boolean> {
    const list = await this.findOne(id, user);
    await this.listRepository.remove(list);
    return true;
  }

  async listCountByUser(user: User): Promise<number> {
    return await this.listRepository.count({
      where: { user: { id: user.id } },
    });
  }
}
