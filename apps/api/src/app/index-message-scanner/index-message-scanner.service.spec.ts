import { Test, TestingModule } from '@nestjs/testing';
import { IndexMessageScannerService } from './index-message-scanner.service';

describe('IndexMessageScannerService', () => {
  let service: IndexMessageScannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndexMessageScannerService],
    }).compile();

    service = module.get<IndexMessageScannerService>(IndexMessageScannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
