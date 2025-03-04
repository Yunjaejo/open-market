import { RefreshToken } from '@prisma/client';

export interface RefreshTokenRepository {
  upsert(userId: number, token: string, expiresIn: number): Promise<void>;

  findByUserId(userId: number): Promise<RefreshToken | null>;
}
