import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DuplicateEmailException } from '../exceptions/duplicate-email.exception';
import { DuplicateNicknameException } from '../exceptions/duplicate-nickname.exception';
import { DuplicatePhoneException } from '../exceptions/duplicate-phone.exception';

@Injectable()
export class DuplicateCheckService {
  constructor(private readonly prisma: PrismaService) {}

  async checkDuplicate(email?: string, nickname?: string, phone?: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { nickname }, { phone }],
      },
    });

    if (!existingUser) {
      return;
    }
    if (existingUser.email === email) {
      throw new DuplicateEmailException();
    }
    if (existingUser.nickname === nickname) {
      throw new DuplicateNicknameException();
    }
    if (existingUser.phone === phone) {
      throw new DuplicatePhoneException();
    }
  }
}
