import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  nickname?: string;

  @IsString()
  phone?: string;

  @IsString()
  address?: string;
}
