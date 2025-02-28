import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { DuplicateCheckService } from '../common/services/duplicate-check.service';
import { PasswordService } from '../common/services/password.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly duplicateCheckService: DuplicateCheckService,
    private readonly passwordService: PasswordService,
  ) {}

  private readonly expiresDay = 15;

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

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.validate(loginUserDto.email, loginUserDto.pwd);
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async validate(email: string, pwd: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.compare(pwd, user.pwd);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async createAccessToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      nickname: user.nickname,
      type: user.type,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
      expiresIn: '15m',
    });
  }

  async createRefreshToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      nickname: user.nickname,
      type: user.type,
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_KEY'),
      expiresIn: `${this.expiresDay}d`,
    });

    await this.saveRefreshToken(user, refreshToken);

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_KEY,
      expiresIn: `${this.expiresDay}d`,
    });
  }

  private async saveRefreshToken(user: User, refreshToken: string) {
    await this.prisma.refreshToken.upsert({
      where: { userId: user.id },
      update: {
        token: refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000 * this.expiresDay),
      },
      create: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000 * this.expiresDay),
      },
    });
  }

  async refreshAccessToken(userId: string) {
    const token = await this.prisma.refreshToken.findFirst({
      where: { userId },
    });

    if (!token) {
      throw new Error('Invalid refresh token');
    }

    const user = await this.usersService.findById(userId);

    return this.createAccessToken(user);
  }
}
