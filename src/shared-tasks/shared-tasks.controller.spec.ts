import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ITask } from 'src/task/task.interface';
import { TaskDocument } from 'src/task/task.schema';
import { SharedTasksController } from './shared-tasks.controller';
import { SharedTasksService } from './shared-tasks.service';

describe('SharedTasksController', () => {
  let controller: SharedTasksController;
  let service: SharedTasksService;

  const mockTaskModel = {
    findById: jest.fn().mockReturnValue({ exec: jest.fn() }),
    find: jest.fn().mockReturnValue({ exec: jest.fn() }),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharedTasksController],
      providers: [
        SharedTasksService,
        {
          provide: getModelToken('Task'),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    controller = module.get<SharedTasksController>(SharedTasksController);
    service = module.get<SharedTasksService>(SharedTasksService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('shareTask', () => {
    const task = {
      _id: '1',
      title: 'Task 1',
      description: 'Task description 1',
      userId: 'user1',
      sharedWith: [],
    };

    it('should share a task with a friend', async () => {
      const friendId = 'user2';

      mockTaskModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValueOnce(task) });
      mockTaskModel.create.mockResolvedValueOnce({ ...task, sharedWith: [friendId] });

      const result = await controller.shareTask('user1', '1', friendId, { username: 'user1' });
      expect(mockTaskModel.findById).toHaveBeenCalledWith('1');
      expect(mockTaskModel.create).toHaveBeenCalledWith({ ...task, sharedWith: [friendId] });
      expect(result).toEqual({ ...task, sharedWith: [friendId] });
    });

    it('should throw a NotFoundException if the task is not found', async () => {
      mockTaskModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValueOnce(null) });

      await expect(controller.shareTask('user1', '1', 'user2', { username: 'user1' })).rejects.toThrowError(
        new NotFoundException('Task with id 1 not found'),
      );
      expect(mockTaskModel.findById).toHaveBeenCalledWith('1');
      expect(mockTaskModel.create).not.toHaveBeenCalled();
    });

    it('should throw an UnauthorizedException if the user is not authorized to share the task', async () => {
      await expect(controller.shareTask('user2', '1', 'user3', { username: 'user1' })).rejects.toThrowError(
        new UnauthorizedException(),
      );
      expect(mockTaskModel.findById).not.toHaveBeenCalled();
      expect(mockTaskModel.create).not.toHaveBeenCalled();
    });
  });

  describe('findSharedTasks', () => {
    const userId = 'test-user';
    const user = { username: userId };

    it('should throw UnauthorizedException if user is not authorized', async () => {
        jest.spyOn(service, 'findSharedTasks').mockResolvedValueOnce(undefined);
        const promise = controller.findSharedTasks(userId, {});
        await expect(promise).rejects.toThrowError(UnauthorizedException);
    });

    it('should return shared tasks if user is authorized', async () => {
        const tasks = [
          {_id: '1', title: 'Task 1', description: 'Task description 1', userId: userId, sharedWith: ['user2', 'user3']},
          {_id: '2', title: 'Task 2', description: 'Task description 2', userId: userId,sharedWith: ['user1']},
        ];
        jest.spyOn(service, 'findSharedTasks').mockResolvedValueOnce(tasks.map(task => task as unknown as ITask));
        const result = await controller.findSharedTasks(userId, user);
        expect(result).toEqual(tasks);
    });
  });


  describe('findTasksSharedWithUser', () => {
    it('should return tasks shared with the user', async () => {
      const tasks = [
        {_id: '1', title: 'Task 1', description: 'Task description 1', userId: 'user1', sharedWith: ['user2', 'user3']},
        {_id: '2', title: 'Task 2', description: 'Task description 2', userId: 'user2',sharedWith: ['user1']},
      ];

      jest.spyOn(service, 'findTasksSharedWithUser').mockResolvedValue(tasks.map(task => task as unknown as ITask));

      const result = await controller.findTasksSharedWithUser('user1', { username: 'user1' });

      expect(service.findTasksSharedWithUser).toHaveBeenCalledWith('user1');
      expect(result).toEqual(tasks);
    });

    it('should throw an UnauthorizedException if the user is not authorized', async () => {
      jest.spyOn(service, 'findTasksSharedWithUser').mockResolvedValue([]);

      await expect(
        controller.findTasksSharedWithUser('user2', { username: 'user1' }),
      ).rejects.toThrowError('Unauthorized');
    });
  });


});
