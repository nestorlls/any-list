import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';

import { UsersService } from './users.service';
import { ItemsService } from 'src/items/items.service';

import { User } from './entities/user.entity';
import { Item } from 'src/items/entities/item.entity';

import { UpdateUserInput } from './dto/inputs/update-user.input';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { ValidRolesArgs } from 'src/auth/dto/args/roles.arg';
import { ValidRoles } from 'src/auth/enums/valid-roles.enums';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemService: ItemsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
    @CurrentUser([ValidRoles.admin]) adminUser: User,
  ): Promise<User[]> {
    return this.usersService.findAll(
      validRoles.roles,
      paginationArgs,
      searchArgs,
    );
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.usersService.update(updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => Int, { name: 'itenCount' })
  itemCount(@Parent() user: User): Promise<number> {
    return this.itemService.itemCountByUser(user);
  }

  @ResolveField(() => [Item], { name: 'items' })
  getItemsByUser(
    @Parent() user: User,
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchTerm: SearchArgs,
  ): Promise<Item[]> {
    return this.itemService.findAll(paginationArgs, searchTerm, user);
  }
}
