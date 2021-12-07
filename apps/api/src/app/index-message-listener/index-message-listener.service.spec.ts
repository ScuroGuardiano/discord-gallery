import { Test, TestingModule } from '@nestjs/testing';
import { IndexMessageListenerService } from './index-message-listener.service';

describe('IndexMessageListenerService', () => {
  let service: IndexMessageListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndexMessageListenerService],
    }).compile();

    service = module.get<IndexMessageListenerService>(IndexMessageListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
