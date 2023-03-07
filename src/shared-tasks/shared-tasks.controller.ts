import { Controller, Get, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ITask as Task} from '../task/task.interface';
import { GetUser } from '../user/get-user.decorator';
import { SharedTasksService } from './shared-tasks.service';


@Controller('user')
export class SharedTasksController {
  constructor(private readonly sharedTasksService: SharedTasksService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':userId/task/:taskId/share/:friendId')
    async shareTask(
        @Param('userId') userId: string, 
        @Param('taskId') taskId: string, 
        @Param('friendId') friendId: string, 
        @GetUser() user
    ): Promise<Task> {
        if (userId !== user.username) {
            throw new UnauthorizedException();
        }
        return this.sharedTasksService.shareTask(friendId, taskId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/shared-tasks')
    async findSharedTasks(@Param('userId') userId: string, @GetUser() user): Promise<Task[]> {
        if (userId !== user.username) {
            throw new UnauthorizedException();
        }
        return this.sharedTasksService.findSharedTasks(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId/shared-with-me')
    async findTasksSharedWithUser(@Param('userId') userId: string, @GetUser() user): Promise<Task[]> {
        if (userId !== user.username) {
            throw new UnauthorizedException();
        }
        return this.sharedTasksService.findTasksSharedWithUser(userId);
    }


}