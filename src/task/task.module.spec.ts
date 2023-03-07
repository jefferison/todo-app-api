import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskModule } from './task.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task, TaskSchema } from './task.schema';

describe('TaskModule', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/nest'),
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
        TaskModule,
      ],
    }).compile();

    taskController = moduleRef.get<TaskController>(TaskController);
    taskService = moduleRef.get<TaskService>(TaskService);
  });

  describe('TaskController', () => {
    it('should be defined', () => {
      expect(taskController).toBeDefined();
    });
  });

  describe('TaskService', () => {
    it('should be defined', () => {
      expect(taskService).toBeDefined();
    });
  });
});
