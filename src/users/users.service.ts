import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from '../common/services/password.service';
import { DuplicateCheckService } from '../common/services/duplicate-check.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly duplicateCheckService: DuplicateCheckService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { pwd, ...userData } = createUserDto;
    await this.duplicateCheckService.checkDuplicate(
      userData.email,
      userData.nickname,
      userData.phone,
    );

    const hashPwd = await this.passwordService.hashPwd(pwd);

    const user = {
      ...userData,
      pwd: hashPwd,
    };

    return this.prisma.user.create({ data: user });
  }
}
