import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { ListItem } from './entities/list-item.entity';

import { CreateListItemInput, UpdateListItemInput } from './dto/inputs';
import { ListItemService } from './list-item.service';

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem)
  createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
    // @CurrentUser() user: User,
  ): Promise<ListItem> {
    return this.listItemService.create(createListItemInput);
  }

  // @Query(() => [ListItem], { name: 'listItem' })
  // findAll() {
  //   return this.listItemService.findAll();
  // }

  // @Query(() => ListItem, { name: 'listItem' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.findOne(id);
  // }

  // @Mutation(() => ListItem)
  // updateListItem(@Args('updateListItemInput') updateListItemInput: UpdateListItemInput) {
  //   return this.listItemService.update(updateListItemInput.id, updateListItemInput);
  // }

  // @Mutation(() => ListItem)
  // removeListItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.remove(id);
  // }
}
