import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { RegisterInput } from 'src/auth/dto/input';
import { ValidRoles } from 'src/auth/enums/valid-roles.enums';

@InputType()
export class UpdateUserInput extends PartialType(RegisterInput) {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field(() => [ValidRoles], { nullable: true })
  @IsArray()
  @IsOptional()
  roles?: ValidRoles[];

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
