import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  fullName: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field(() => [String])
  @Column({ type: 'text', array: true, default: ['user'] })
  roles: string[];

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // todo: relations here
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.lastUpdatedBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdatedBy' })
  lastUpdatedBy?: User;

  // @Field(() => [Item], { nullable: true })
  @OneToMany(() => Item, (item) => item.user, { lazy: true })
  items: Item[];

  @OneToMany(() => List, (list) => list.user)
  list: List[];
}
