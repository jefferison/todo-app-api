import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedTasksModule } from './shared-tasks.module';
import { SharedTasksController } from './shared-tasks.controller';
import { SharedTasksService } from './shared-tasks.service';
import { Task, TaskSchema } from '../task/task.schema';

describe('SharedTasksModule', () => {
  let sharedTasksController: SharedTasksController;
  let sharedTasksService: SharedTasksService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/nest'),
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
        SharedTasksModule,
      ],
    }).compile();

    sharedTasksController = moduleRef.get<SharedTasksController>(
      SharedTasksController,
    );
    sharedTasksService = moduleRef.get<SharedTasksService>(SharedTasksService);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(sharedTasksController).toBeDefined();
    });
  });
});
