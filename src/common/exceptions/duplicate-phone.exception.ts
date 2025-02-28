import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicatePhoneException extends HttpException {
  constructor() {
    super('Phone number already exists', HttpStatus.BAD_REQUEST);
  }
}
