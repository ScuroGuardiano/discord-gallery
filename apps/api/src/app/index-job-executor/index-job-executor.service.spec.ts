import { Test, TestingModule } from '@nestjs/testing';
import { IndexJobExecutorService } from './index-job-executor.service';

describe('IndexJobExecutorService', () => {
  let service: IndexJobExecutorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndexJobExecutorService],
    }).compile();

    service = module.get<IndexJobExecutorService>(IndexJobExecutorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
