import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities/item.entity';
import { User } from 'src/users/entities/user.entity';

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

  async findAll(user: User): Promise<Item[]> {
    // todo: add pagination, filtering, sorting, etc
    if (user.isActive)
      return await this.itemRepository.find({
        where: {
          user: {
            id: user.id,
          },
        },
      });

    return await this.itemRepository.find();
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
