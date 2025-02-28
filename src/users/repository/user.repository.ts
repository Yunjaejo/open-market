import { UserRepository } from './user.repository.interface';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id },
    });
  }
}
