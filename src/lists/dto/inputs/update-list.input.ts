import { IsUUID } from 'class-validator';
import { CreateListInput } from './create-list.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateListInput extends PartialType(CreateListInput) {
  @Field(() => ID)
  @IsUUID('4', { message: 'The id must be a valid UUID' })
  id: string;
}
