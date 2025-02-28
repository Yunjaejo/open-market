import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { DuplicateCheckService } from '../common/services/duplicate-check.service';
import { PasswordService } from '../common/services/password.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtService,
    UsersService,
    DuplicateCheckService,
    PasswordService,
  ],
})
export class AuthModule {}
