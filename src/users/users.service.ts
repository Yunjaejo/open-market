import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PasswordService } from '../common/services/password.service';
import { DuplicateCheckService } from '../common/services/duplicate-check.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly duplicateCheckService: DuplicateCheckService,
  ) {}

  async findById(userId: string) {
    return this.prisma.user.findFirst({
      where: { id: userId },
    });
  }
}
