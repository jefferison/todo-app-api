import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/user.dto';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {

    constructor(
      private userService: UserService,
      private jwtService: JwtService,
    ) {}

    async register(createUserDto: CreateUserDto): Promise<User> {
      const userExists = await this.userService.findByUsername(createUserDto.username);
      if (userExists) {
          throw new UnauthorizedException('Username is already taken');
      }
      return this.userService.create(createUserDto);
    }

    async validateUser(username: string, password: string): Promise<User> {
      const user = await this.userService.findByUsername(username);
      if (!user) {
          throw new UnauthorizedException();
      }
      const isValidPassword = password === user.password;
      if (!isValidPassword) {
          throw new UnauthorizedException();
      }
      return user;
    }

    async login(user: User): Promise<{ accessToken: string }> {
      const payload = { username: user.username, sub: user._id };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }

}

