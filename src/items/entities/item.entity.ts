import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  category: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits?: string;
  // stores
  // user
  @ManyToOne(() => User, (user) => user.items, {
    nullable: false,
    lazy: true,
  })
  @Index('user_id_idx')
  @Field(() => User)
  user: User;

  @Field(() => [ListItem])
  @OneToMany(() => ListItem, (listItem) => listItem.item, { lazy: true })
  listItem: ListItem[];
}
