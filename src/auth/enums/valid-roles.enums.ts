import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  ADMIN = 'admin',
  USER = 'user',
  SUPERUSER = 'superuser',
}

registerEnumType(ValidRoles, { name: 'ValidRoles' });
