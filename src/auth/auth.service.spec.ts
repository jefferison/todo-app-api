import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/user/user.schema';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: {
          findByUsername: jest.fn(),
          create: jest.fn()
        } },
        { provide: JwtService, useValue: {
          sign: jest.fn(() => 'mockToken'),
        } },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    userService = app.get<UserService>(UserService);
    jwtService = app.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should throw an error if the username is already taken', async () => {
      const mockUser = {
        id: 'test-id',
        username: 'testUser',
        password: 'password',
      };
      
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(mockUser as User)

      const mockCreateUserDto = {
        username: 'testUser',
        password: 'newPassword',
      };
      await expect(authService.register(mockCreateUserDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should create a new user if the username is not taken', async () => {
      const mockCreateUserDto = {
        username: 'testUser',
        password: 'password',
      };
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(undefined);
      jest.spyOn(userService, 'create').mockResolvedValue(mockCreateUserDto as User);

      const result = await authService.register(mockCreateUserDto);
      expect(result).toEqual(mockCreateUserDto);
    });
  });

  describe('validateUser', () => {

    it('should return a user if username and password are correct', async () => {
      const username = 'existinguser';
      const password = 'password';
      const expectedUser = {
        _id: 'userId',
        username: 'existinguser',
        password: 'password',
      };
      jest.spyOn(userService, 'findByUsername').mockResolvedValueOnce(
        expectedUser as User
      );

      const result = await authService.validateUser(username, password);

      expect(userService.findByUsername).toHaveBeenCalledWith('existinguser');
      expect(result).toEqual(expectedUser);
    });

    it('should throw an error if user is not found', async () => {
      const username = 'nonexistinguser';
      const password = 'password';
      jest.spyOn(userService, 'findByUsername').mockResolvedValueOnce(null);

      await expect(
        authService.validateUser(username, password),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if password is incorrect', async () => {
      const username = 'existinguser';
      const password = 'incorrectpassword';
      const expectedUser = {
        _id: 'userId',
        username: 'existinguser',
        password: 'password',
      };
      jest.spyOn(userService, 'findByUsername').mockResolvedValueOnce(
        expectedUser as User
      );

      await expect(
        authService.validateUser(username, password))
        .rejects.toThrow(UnauthorizedException);
    });
      
  });

  describe('login', () => {
    it('should return an access token for a valid user', async () => {

      const user = {
        _id: 'userId',
        username: 'existinguser',
        password: 'password',
      };
      const expectedAccessToken = 'jwtToken';
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(expectedAccessToken);
  
      const result = await authService.login(user as User);
  
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: user.username,
        sub: user._id,
      });
      expect(result).toEqual({ accessToken: expectedAccessToken });
    });
  
  });
  

});
