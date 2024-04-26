import { Injectable } from '@nestjs/common';

import { CreateItemInput, UpdateItemInput } from './dto';

@Injectable()
export class ItemsService {
  create(createItemInput: CreateItemInput) {
    return {};
  }

  findAll() {
    return [];
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemInput: UpdateItemInput) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}