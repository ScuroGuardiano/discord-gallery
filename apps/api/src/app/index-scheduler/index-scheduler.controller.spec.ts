import { Test, TestingModule } from '@nestjs/testing';
import { IndexSchedulerController } from './index-scheduler.controller';

describe('IndexSchedulerController', () => {
  let controller: IndexSchedulerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndexSchedulerController],
    }).compile();

    controller = module.get<IndexSchedulerController>(IndexSchedulerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
