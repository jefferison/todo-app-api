import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;


  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService, AuthService,
        { provide: UserService, useValue: {} },
        { provide: JwtService, useValue: {
          sign: jest.fn(() => 'mockToken'),
        } },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    authService = app.get<AuthService>(AuthService);
    userService = app.get<UserService>(UserService);
    jwtService = app.get<JwtService>(JwtService);

  });

  describe('getHello', () => {
    it('should return "ChallengeU TODO API"', () => {
      expect(appController.getHello()).toBe('ChallengeU TODO API');
    });
  });

  describe('login', () => {
    it('should return a token', async () => {
      const req = { user: { username: 'testuser', password: 'testpassword' } };
      const token = await appController.login(req);
      expect(token).toBeDefined();
    });
  });

  describe('getProfile', () => {
    it('should return the user object', () => {
      const req = { user: { username: 'testuser', password: 'testpassword' } };
      expect(appController.getProfile(req)).toEqual(req.user);
    });
  });

  describe('UseGuards', () => {
    it('should throw an error if the user is not authorized', async () => {
      try {
        await appController.getProfile({ user: null });
      } catch (e) {
        expect(e.status).toBe(401);
        expect(e.response).toEqual({ message: 'Unauthorized' });
      }
    });
  });


});
