import { Controller, Body, Get, Post, Param, UseGuards, UnauthorizedException } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './task.dto';
import { Task } from './task.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../user/get-user.decorator';


@Controller('user')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':userId/task')
    async createTask(@Param('userId') userId: string, @Body() taskDto: TaskDto, @GetUser() user): Promise<Task> {
        if (userId !== user.username) {
            throw new UnauthorizedException();
        }
        return this.taskService.createTask(userId, taskDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/task')
    async getTasksByUserId(@Param('userId') userId: string, @GetUser() user): Promise<Task[]> {
        if (userId !== user.username) {
            throw new UnauthorizedException();
        }
        return this.taskService.getTasksByUserId(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/task/:taskId')
    async getTaskById(@Param('userId') userId: string, @Param('taskId') taskId: string, @GetUser() user): Promise<Task> {
        if (userId !== user.username) {
            throw new UnauthorizedException();
        }
        return this.taskService.getTaskById(userId, taskId);
    }


}
