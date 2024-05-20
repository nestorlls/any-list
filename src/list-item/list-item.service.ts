import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ListItem } from './entities/list-item.entity';
import { List } from '../lists/entities/list.entity';

import { PaginationArgs, SearchArgs } from '../common/dto/args';

import { CreateListItemInput, UpdateListItemInput } from './dto/inputs';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
  ) {}
  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { listId, itemId, ...rest } = createListItemInput;
    const newListItem = this.listItemRepository.create({
      ...rest,
      list: { id: listId },
      item: { id: itemId },
    });
    return await this.listItemRepository.save(newListItem);
  }

  async findAll(
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
    list: List,
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemRepository
      .createQueryBuilder('listItem')
      .innerJoin('listItem.item', 'item')
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });

    if (search) {
      queryBuilder.andWhere(`LOWER(item.name) LIKE LOWER(:name)`, {
        name: `%${search}%`,
      });
    }

    return queryBuilder.getMany();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} listItem`;
  // }

  // update(id: number, updateListItemInput: UpdateListItemInput) {
  //   return `This action updates a #${id} listItem`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} listItem`;
  // }

  async countListItems(list: List): Promise<number> {
    return await this.listItemRepository.count({
      where: { list: { id: list.id } },
    });
  }
}
