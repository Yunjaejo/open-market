import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PasswordService } from '../common/services/password.service';
import { DuplicateCheckService } from '../common/services/duplicate-check.service';
import { PrismaUserRepository } from './repository/user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PasswordService,
    DuplicateCheckService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: [
    UsersService,
    PasswordService,
    DuplicateCheckService,
    'UserRepository',
  ],
})
export class UsersModule {}
