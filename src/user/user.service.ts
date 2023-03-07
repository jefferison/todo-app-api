import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        return await this.userModel.create({...createUserDto})
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userModel.findOne({ username }).exec();
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

}
