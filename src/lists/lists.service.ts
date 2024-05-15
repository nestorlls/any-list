import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/inputs/create-list.input';
import { UpdateListInput } from './dto/inputs/update-list.input';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

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
    const list = await this.listRepository.preload(updateListInput);
    if (!list) throw new NotFoundException(`List with id '${id}' not found`);
    return this.listRepository.save(list);
  }

  remove(id: number) {
    return `This action removes a #${id} list`;
  }
}
