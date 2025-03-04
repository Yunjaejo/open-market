import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from '../common/services/password.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenRepository } from './repository/token.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    @Inject('TokenRepository')
    private readonly tokenRepository: RefreshTokenRepository,
  ) {}

  private readonly expiresDay = 15;

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.validate(loginUserDto.email, loginUserDto.pwd);
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async validate(email: string, pwd: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.compare(pwd, user.pwd);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  async tokenDecode(refreshToken: string) {
    return this.jwtService.decode(refreshToken);
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
    await this.tokenRepository.upsert(user.id, refreshToken, this.expiresDay);
  }

  async refreshAccessToken(userId: number) {
    const token = await this.tokenRepository.findByUserId(userId);

    if (!token || token.userId !== userId) {
      throw new Error('Invalid refresh token');
    }

    const user = await this.usersService.findById(userId);

    return this.createAccessToken(user);
  }

  async tokenValidateUser(payload: any) {
    return this.usersService.findById(payload.sub);
  }
}
