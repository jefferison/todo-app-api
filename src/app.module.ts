import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SharedTasksModule } from './shared-tasks/shared-tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(process.env.MONGODB_URL),
    TaskModule,
    PassportModule,
    UserModule,
    AuthModule,
    SharedTasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
