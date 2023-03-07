import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskService } from './task.service';
import { Task, TaskSchema } from './task.schema';
import { NotFoundException } from '@nestjs/common';


describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;
  let model: Model<Task>;

  const mockTask = {
    _id: '60f4d84e6548e45c10e26717',
    title: 'Task 1',
    description: 'Task 1 description',
    userId: '12345',
  };

  const mockTaskService = {
    createTask: () => Promise.resolve(mockTask),
    getTasksByUserId: () => Promise.resolve([mockTask]),
    getTaskById: () => Promise.resolve(mockTask),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        {
          provide: getModelToken('Task'),
          useValue: Model,
        },
      ],
    })
    .overrideProvider(TaskService)
    .useValue(mockTaskService)
    .compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
    model = module.get<Model<Task>>(getModelToken('Task'));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task and return it', async () => {
      const taskDto = { title: 'Task 1', description: 'Task 1 description', userId: '12345', _id: '60f4d84e6548e45c10e26717'};
      expect(await controller.createTask('12345', taskDto, {username: '12345', _id:'12345'})).toBe(mockTask);
    });
  });

  describe('getTasksByUserId', () => {
    it('should return an array of tasks', async () => {
      expect(await controller.getTasksByUserId('12345', {username: '12345', _id:'12345'})).toEqual([mockTask]);
    });
  });

  describe('getTaskById', () => {
    it('should return a task with the given ID', async () => {
      expect(await controller.getTaskById('12345', '60f4d84e6548e45c10e26717', {username: '12345', _id:'12345'})).toBe(mockTask);
    });
  });


});
