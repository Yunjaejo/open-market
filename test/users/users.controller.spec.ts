import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { afterEach } from 'node:test';
import { UpdateUserDto } from '../../src/users/dto/update-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUser: User = {
    id: 'abcd-1234',
    name: 'test',
    email: 'test@test.test',
    type: 'SELLER',
    address: 'test-test-123',
    pwd: 'abc-123-abc-456',
    nickname: 'test-man',
    phone: '82101234',
    createdAt: new Date(),
    updatedAt: null,
    isDeleted: false,
  };

  const mockUsersService = {
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  mockUsersService.findById.mockImplementation((id) => {
    return { ...mockUser, id: id };
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    afterEach(async () => {
      jest.clearAllMocks();
    });

    usersController = module.get(UsersController);
  });

  it('id로 유저를 찾을 때, 같은 id의 유저가 리턴되어야 한다.', async () => {
    mockUsersService.findById.mockResolvedValue(mockUser);
    const result = await usersController.getUser('abcd-1234');

    expect(result).toEqual(mockUser);
  });

  it('유저는 업데이트되어야 한다.', async () => {
    const userId = 'abcd-1234';
    const updateUserDto: UpdateUserDto = {
      nickname: 'monkey',
    };
    const mockUpdateUser = {
      nickname: 'monkey',
      ...updateUserDto,
    };
    mockUsersService.update.mockResolvedValue(mockUpdateUser);

    const result = await usersController.updateUser(userId, updateUserDto);

    expect(result).toEqual(mockUpdateUser);
  });

  describe('deleteUser', () => {
    it('유저는 soft delete 되어야 한다.', async () => {
      const userId = 'abcd-1234';
      const mockResult = {
        ...mockUser,
        isDeleted: true,
      };

      mockUsersService.remove.mockResolvedValue(mockResult);

      const result = await usersController.deleteUser(userId);

      expect(result).toEqual(mockResult);
    });
  });
});
