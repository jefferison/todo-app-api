import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema, UserModel } from './user.schema';

describe('UserModule', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/nest'),
        MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
        UserModule,
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  describe('UserController', () => {
    it('should be defined', () => {
      expect(userController).toBeDefined();
    });
  });

  describe('UserService', () => {
    it('should be defined', () => {
      expect(userService).toBeDefined();
    });
  });
});
