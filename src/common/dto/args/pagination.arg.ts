import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsPositive()
  @IsOptional()
  offset?: number = 0;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsPositive()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
