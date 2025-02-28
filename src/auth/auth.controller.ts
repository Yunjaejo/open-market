import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly tokenMaxAge = 15;

  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const user = await this.authService.validate(
      loginUserDto.email,
      loginUserDto.pwd,
    );

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).send('Invalid');
    }
    const { accessToken, refreshToken } =
      await this.authService.loginUser(loginUserDto);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod',
      maxAge: 60 * 1000 * 60 * 24 * this.tokenMaxAge,
    });

    return res.status(200).json({ accessToken });
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req: Request) {
    const userId = req.cookies.user.userId;
    return await this.authService.refreshAccessToken(userId);
  }
}
