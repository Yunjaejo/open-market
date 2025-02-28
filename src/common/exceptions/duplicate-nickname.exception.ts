import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateNicknameException extends HttpException {
  constructor() {
    super('Nickname already exists', HttpStatus.BAD_REQUEST);
  }
}
