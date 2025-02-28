import { User } from '@prisma/client';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;

  findById(id: string): Promise<User | null>;

  create(user: Partial<User>): Promise<User>;

  update(id: string, updateUserDto: UpdateUserDto): Promise<User>;

  delete(id: string): Promise<User>;
}
