import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enums';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (roles: ValidRoles[] = [], context: ExecutionContext) => {
    console.log({ roles });
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;
    if (!user) {
      throw new InternalServerErrorException(
        'No user inside the request - make sure that we used the AuthGuard',
      );
    }

    if (roles.length === 0) return user;

    //todo: remore this validation
    for (const role of roles) {
      if (!user.roles.includes(role)) {
        throw new ForbiddenException(
          `User ${user.fullName} does not have required role [${roles}]`,
        );
      }
    }

    return user;
  },
);
