import { Controller, Get } from '@nestjs/common';
import { BlockchainAdapterService } from '../../infrastructure/blockchain-adapter/blockchain-adapter.service';

@Controller('api')
export class BlockchainController {
  constructor(
    private readonly blockchainAdapterService: BlockchainAdapterService,
  ) {}

  @Get('token-info')
  async getTokenInfo() {
    return this.blockchainAdapterService.getTokenInfo();
  }
}
