import { RefreshToken } from '@prisma/client';

export interface RefreshTokenRepository {
  upsert(userId: string, token: string, expiresIn: number): Promise<void>;

  findByUserId(userId: string): Promise<RefreshToken | null>;
}
