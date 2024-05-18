import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Item } from './entities/item.entity';
import { SearchArgs, PaginationArgs } from '../common/dto/args';
import { CreateItemInput, UpdateItemInput } from './dto';
import { User } from '../users/entities/user.entity';
@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}
  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemRepository.create({ ...createItemInput, user });
    return await this.itemRepository.save(newItem);
  }

  async findAll(
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
    user: User,
  ): Promise<Item[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.itemRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere(`LOWER(name) LIKE LOWER(:name)`, {
        name: `%${search}%`,
      });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });
    if (!item) throw new NotFoundException(`Item with id '${id}' not found`);
    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    this.findOne(id, user);
    try {
      const item = await this.itemRepository.preload(updateItemInput);
      return await this.itemRepository.save(item);
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string, user: User): Promise<boolean> {
    // todo: add soft delete
    const item = await this.findOne(id, user);
    await this.itemRepository.remove(item);
    return true;
  }

  async itemCountByUser(user: User): Promise<number> {
    return await this.itemRepository.count({
      where: { user: { id: user.id } },
    });
  }
}
