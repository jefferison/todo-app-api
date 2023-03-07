import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './user.dto';


@Controller('users')
export class UserController {
    
}
