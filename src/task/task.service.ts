import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TaskDto } from './task.dto';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TaskService {
    constructor(@InjectModel('Task') private readonly taskModel: Model<TaskDocument>) {}

    async createTask(userId: string, createTaskDto: TaskDto): Promise<Task> {
        return await this.taskModel.create({...createTaskDto, userId})
    }

    async getTaskById(userId: string, taskId: string): Promise<Task> {
        const task = await this.taskModel.findOne({ userId, _id: taskId }).exec();
        if (!task) {
            throw new NotFoundException('Task data not found!');
        }
        return task;
    }

    async getTasksByUserId(userId: string): Promise<Task[]> {
        const taskData = await this.taskModel.find({ userId }).exec();
        if (!taskData || taskData.length == 0) {
            throw new NotFoundException('Tasks data not found!');
        }
        return taskData
    }

}
