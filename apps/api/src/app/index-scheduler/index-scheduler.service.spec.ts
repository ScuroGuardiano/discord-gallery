import { Test, TestingModule } from '@nestjs/testing';
import { IndexSchedulerService } from './index-scheduler.service';

describe('IndexSchedulerService', () => {
  let service: IndexSchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndexSchedulerService],
    }).compile();

    service = module.get<IndexSchedulerService>(IndexSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
