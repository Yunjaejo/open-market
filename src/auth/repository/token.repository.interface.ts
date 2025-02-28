export interface RefreshTokenRepository {
  upsert(userId: string, token: string, expiresAt: Date): Promise<void>;

  findByUserId(
    userId: string,
  ): Promise<{ token: string; expiresAt: Date } | null>;
}
