import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainAdapterService } from './blockchain-adapter.service';

describe('BlockchainAdapterService', () => {
  let service: BlockchainAdapterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockchainAdapterService],
    }).compile();

    service = module.get<BlockchainAdapterService>(BlockchainAdapterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
