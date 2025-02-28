import { Injectable } from '@nestjs/common';
import { compareSync, hash } from 'bcryptjs';

@Injectable()
export class PasswordService {
  async hashPwd(pwd: string) {
    return await hash(pwd, 10);
  }

  async compare(pwd: string, hashedPwd: string) {
    return compareSync(pwd, hashedPwd);
  }
}
