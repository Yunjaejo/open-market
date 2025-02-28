import { Inject, Injectable } from '@nestjs/common';
import { PasswordService } from '../common/services/password.service';
import { DuplicateCheckService } from '../common/services/duplicate-check.service';
import { UserRepository } from './repository/user.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly duplicateCheckService: DuplicateCheckService,
  ) {}

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

    return this.userRepository.create(user);
  }

  async findById(userId: string) {
    return this.userRepository.findById(userId);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
