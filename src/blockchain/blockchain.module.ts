import { Module } from '@nestjs/common';
import { BlockchainAdapterService } from './infrastructure/blockchain-adapter/blockchain-adapter.service';
import { BlockchainController } from './presentation/blockchain/blockchain.controller';

@Module({
  providers: [BlockchainAdapterService],
  controllers: [BlockchainController],
})
export class BlockchainModule {}
