import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITask as Task } from '../task/task.interface';


@Injectable()
export class SharedTasksService {
    constructor(
        @InjectModel('Task') private readonly taskModel: Model<Task>,
    ) {}

    async shareTask(userId: string, taskId: string): Promise<Task> {
        const task = await this.taskModel.findById(taskId).exec();
        if (!task) {
            throw new NotFoundException(`Task with id ${taskId} not found`);
        }
        task.sharedWith.push(userId);
        return await this.taskModel.create(task)
    }

    async findSharedTasks(userId: string): Promise<Task[]> {
        return this.taskModel.find({username: userId, sharedWith: { $exists: true, $ne: [] } }).exec();
    }

    async findTasksSharedWithUser(userId: string): Promise<Task[]> {
        return this.taskModel.find({ sharedWith: { $in: [userId] } }).exec();
    }
}