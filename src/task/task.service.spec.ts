import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getModelToken } from '@nestjs/mongoose';

describe('TaskService', () => {
  let taskService: TaskService;

  const mockTaskModel = {
    create: jest.fn(),
    exec: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken('Task'),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const taskDto = { title: 'New Task', description: 'New Task Description', userId: '123' };
      const userId = '123';
      const createdTask = { _id: '456', userId, ...taskDto };

      mockTaskModel.create.mockResolvedValueOnce(createdTask);

      const result = await taskService.createTask(userId, taskDto);

      expect(mockTaskModel.create).toHaveBeenCalledWith({ ...taskDto, userId });
      expect(result).toEqual(createdTask);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const taskId = '456';
      const userId = '123';
      const task = { _id: taskId, userId, title: 'New Task', description: 'New Task Description' };

      mockTaskModel.findOne.mockReturnValueOnce({ exec: () => Promise.resolve(task) });

      const result = await taskService.getTaskById(userId, taskId);

      expect(mockTaskModel.findOne).toHaveBeenCalledWith({ userId, _id: taskId });
      expect(result).toEqual(task);
    });

    it('should throw an exception if task is not found', async () => {
      const taskId = '456';
      const userId = '123';

      mockTaskModel.findOne.mockReturnValueOnce({ exec: () => Promise.resolve(null) });

      await expect(taskService.getTaskById(userId, taskId)).rejects.toThrowError('Task data not found!');
    });
  });

  describe('getTasksByUserId', () => {
    it('should return tasks by user id', async () => {
      const userId = '123';
      const tasks = [
        { _id: '456', userId, title: 'New Task', description: 'New Task Description' },
        { _id: '789', userId, title: 'Another Task', description: 'Another Task Description' },
      ];

      mockTaskModel.find.mockReturnValueOnce({ exec: () => Promise.resolve(tasks) });

      const result = await taskService.getTasksByUserId(userId);

      expect(mockTaskModel.find).toHaveBeenCalledWith({ userId });
      expect(result).toEqual(tasks);
    });

    it('should throw an exception if tasks are not found', async () => {
      const userId = '123';

      mockTaskModel.find.mockReturnValueOnce({ exec: () => Promise.resolve([]) });

      await expect(taskService.getTasksByUserId(userId)).rejects.toThrowError('Tasks data not found!');
    });
  });
});

