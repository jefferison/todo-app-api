import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';

describe('UserService', () => {
  let userService: UserService;

  const mockUserModel = {
    create: jest.fn(),
    exec: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });


  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        username: 'testuser',
        password: 'password123',
      };
      const createdUser = {
        id: '123',
        username: 'testuser',
        password: 'password123',
      };

      mockUserModel.create.mockResolvedValueOnce(createdUser);

      const result = await userService.create(createUserDto);

      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      const username = 'testuser';
      const user = {
        id: '123',
        username,
        password: 'password123',
      };

      mockUserModel.findOne.mockReturnValueOnce({ exec: () => Promise.resolve(user) });

      const result = await userService.findByUsername(username);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ username });
      expect(result).toEqual(user);
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const id = '123';
      const user = {
        id,
        username: 'testuser',
        password: 'password123',
      };
      mockUserModel.findById.mockReturnValueOnce({ exec: () => Promise.resolve(user) });

      const result = await userService.findById(id);

      expect(mockUserModel.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(user);
    });
  });
});
