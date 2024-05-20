import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Item } from 'src/items/entities/item.entity';
import { UsersService } from 'src/users/users.service';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { ItemsService } from 'src/items/items.service';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,

    private readonly userService: UsersService,
    private readonly itemService: ItemsService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async execute(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException(`Can't run seed in production`);
    }
    await this.deleteDataBase();
    const users = await this.loadUsers();
    await this.loadItems(users);

    return true;
  }

  private async deleteDataBase() {
    // delete listItems
    await this.listItemRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
    // delete lists
    await this.listRepository.createQueryBuilder().delete().where({}).execute();
    // delete items
    await this.itemRepository.createQueryBuilder().delete().where({}).execute();
    // delete users
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
  }

  private async loadUsers(): Promise<User[]> {
    const usersPromises = [];
    for (const user of SEED_USERS) {
      usersPromises.push(this.userService.create(user));
    }

    return Promise.all(usersPromises);
  }

  private async loadItems(users: User[]): Promise<void> {
    const itemsPromises = [];
    for (const item of SEED_ITEMS) {
      const randomIndex = Math.floor(Math.random() * users.length);
      const user = users[randomIndex];
      itemsPromises.push(this.itemService.create(item, user));
    }

    Promise.all(itemsPromises);
  }
}
