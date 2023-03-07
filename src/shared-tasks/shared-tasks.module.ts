import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from '../task/task.schema';
import { SharedTasksController } from './shared-tasks.controller';
import { SharedTasksService } from './shared-tasks.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    ],
    providers: [SharedTasksService],
    controllers: [SharedTasksController],
})
export class SharedTasksModule {}
