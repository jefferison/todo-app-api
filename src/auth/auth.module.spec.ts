import { Test } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './constants';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from '../user/user.schema';

describe('AuthModule', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/nest'),
        MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
        UserModule,
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy],
      exports: [AuthService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('AuthService', () => {
    it('should be defined', () => {
      expect(authService).toBeDefined();
    });
  });
});
