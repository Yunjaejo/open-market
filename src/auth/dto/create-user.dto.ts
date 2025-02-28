import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserType } from '../user-type.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  pwd: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  nickname: string;

  @IsString()
  address: string;

  @IsEnum(UserType)
  type: UserType;
}
