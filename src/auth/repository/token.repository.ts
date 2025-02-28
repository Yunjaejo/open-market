import { RefreshTokenRepository } from './token.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { RefreshToken } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({
      where: { userId },
    });
  }

  async upsert(
    userId: string,
    refreshToken: string,
    expiresIn: number,
  ): Promise<void> {
    await this.prisma.refreshToken.upsert({
      where: { userId },
      update: {
        token: refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000 * expiresIn),
      },
      create: {
        userId: userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000 * expiresIn),
      },
    });
  }
}
