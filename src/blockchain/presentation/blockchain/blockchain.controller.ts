import { Body, Controller, Get, Post } from '@nestjs/common';
import { BlockchainAdapterService } from '../../infrastructure/blockchain-adapter/blockchain-adapter.service';

@Controller('api')
export class BlockchainController {
  constructor(
    private readonly blockchainAdapterService: BlockchainAdapterService,
  ) {}

  @Get()
  getStatus() {
    return {
      mensaje: 'La API Web3 funciona correctamente',
    };
  }

  @Get('wallet')
  getWallet() {
    return this.blockchainAdapterService.getWallet();
  }

  @Get('balance')
  async getBalance() {
    return await this.blockchainAdapterService.getBalance();
  }

  @Post('transfer')
  async transfer(@Body('to') to: string, @Body('amount') amount: string) {
    return await this.blockchainAdapterService.transfer(to, amount);
  }
}
