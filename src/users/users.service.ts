import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PasswordService } from '../common/services/password.service';
import { DuplicateCheckService } from '../common/services/duplicate-check.service';
import { UserRepository } from './repository/user.repository.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly duplicateCheckService: DuplicateCheckService,
  ) {}

  private async findUserOrFail(query: { id?: number; email?: string }) {
    let user;
    if (query.id) {
      user = await this.userRepository.findById(query.id);
    } else if (query.email) {
      user = await this.userRepository.findByEmail(query.email);
    }

    if (!user) {
      const message = query.id
        ? `User with id ${query.id} not found`
        : `User with email ${query.email} not found`;
      throw new NotFoundException(message);
    }

    return user;
  }

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

  async findById(id: number) {
    return this.findUserOrFail({ id });
  }

  async findByEmail(email: string) {
    return this.findUserOrFail({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { nickname, phone } = updateUserDto;
    await this.duplicateCheckService.checkDuplicate(undefined, nickname, phone);
    await this.findUserOrFail({ id });

    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    await this.findUserOrFail({ id });

    return this.userRepository.delete(id);
  }
}
