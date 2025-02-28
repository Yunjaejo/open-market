import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PasswordService } from '../common/services/password.service';
import { DuplicateCheckService } from '../common/services/duplicate-check.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PasswordService, DuplicateCheckService],
  exports: [PasswordService, DuplicateCheckService],
})
export class UsersModule {}
