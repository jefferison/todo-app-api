import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ITask } from 'src/task/task.interface';
import { SharedTasksService } from './shared-tasks.service';

describe('SharedTasksService', () => {
  let service: SharedTasksService;

  const mockTaskModel = {
    create: jest.fn(),
    exec: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharedTasksService,
        {
          provide: getModelToken('Task'),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<SharedTasksService>(SharedTasksService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shareTask', () => {
    it('should throw NotFoundException if task not found', async () => {
      const taskId = '123';
      const userId = '456';

      mockTaskModel.findById.mockReturnValueOnce({ exec: () => Promise.resolve(null) });

      await expect(service.shareTask(userId, taskId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTaskModel.findById).toHaveBeenCalledWith(taskId);
    });

    it('should update and return task with sharedWith user id', async () => {
      const taskId = '123';
      const userId = '456';
      const task = {
        _id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        userId: '789',
        sharedWith: [],
      };

      mockTaskModel.findById.mockReturnValueOnce({ exec: () => Promise.resolve(task) });
      mockTaskModel.create.mockReturnValueOnce({ ...task, sharedWith: [userId] });

      const result = await service.shareTask(userId, taskId);
      expect(mockTaskModel.findById).toHaveBeenCalledWith(taskId);
      expect(mockTaskModel.create).toHaveBeenCalledWith({ ...task, sharedWith: [userId] });
      expect(result).toEqual({ ...task, sharedWith: [userId] });
    });
  });

  describe('findSharedTasks', () => {
    it('should return tasks shared with user', async () => {
      const userId = '456';
      const tasks = [
        {
          _id: '123',
          title: 'Test Task 1',
          description: 'Test Description 1',
          userId: '789',
          sharedWith: [userId],
        },
        {
          _id: '456',
          title: 'Test Task 2',
          description: 'Test Description 2',
          userId: '123',
          sharedWith: [userId],
        },
      ];

      mockTaskModel.find.mockReturnValueOnce({ exec: () => Promise.resolve(tasks)});

      const result = await service.findSharedTasks(userId);
      expect(mockTaskModel.find).toHaveBeenCalledWith({ username: userId, sharedWith: { $exists: true, $ne: [] } });
      expect(result).toEqual(tasks);
    });
  });

  describe('findTasksSharedWithUser', () => {
    it('should return tasks shared with user', async () => {
      const userId = '456';
      const tasks = [
        {
          _id: '123',
          title: 'Test Task 1',
          description: 'Test Description 1',
          userId: '789',
          sharedWith: [userId],
        },
        {
          _id: '456',
          title: 'Test Task 2',
          description: 'Test Description 2',
          userId: '123',
          sharedWith: [userId],
        },
      ];

      mockTaskModel.find.mockReturnValueOnce({ exec: () => Promise.resolve(tasks)});

      const result = await service.findTasksSharedWithUser(userId);
      expect(mockTaskModel.find).toHaveBeenCalledWith({ sharedWith: { $in: [userId] } });
      expect(result).toEqual(tasks);
    });

    it('should return an empty array if no tasks are shared with user', async () => {
      const userId = '456';
      const tasks = [];

      mockTaskModel.find.mockReturnValueOnce({ exec: () => Promise.resolve(tasks)});

      const result = await service.findTasksSharedWithUser(userId);
      expect(mockTaskModel.find).toHaveBeenCalledWith({ sharedWith: { $in: [userId] } });
      expect(result).toEqual(tasks);
    });



  });

});
