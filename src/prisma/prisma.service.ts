import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    const dbHost = configService.get<string>('DATABASE_HOST'); // DATABASE_HOST
    const dbPort = configService.get<number>('DATABASE_PORT'); // DATABASE_PORT
    const dbUser = configService.get<string>('DATABASE_USER'); // DATABASE_USER
    const dbPassword = configService.get<string>('DATABASE_PASSWORD'); // DATABASE_PASSWORD
    const dbName = configService.get<string>('DATABASE_NAME'); // DATABASE_NAME

    const databaseUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('DB Connected!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('DB Disconnected!');
  }
}
