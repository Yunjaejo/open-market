import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';

@Injectable()
export class PasswordService {
  async hashPwd(pwd: string) {
    return await hash(pwd, 10);
  }
}
