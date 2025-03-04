import { User } from '@prisma/client';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;

  findById(id: number): Promise<User | null>;

  create(user: Partial<User>): Promise<User>;

  update(id: number, updateUserDto: UpdateUserDto): Promise<User>;

  delete(id: number): Promise<User>;
}
