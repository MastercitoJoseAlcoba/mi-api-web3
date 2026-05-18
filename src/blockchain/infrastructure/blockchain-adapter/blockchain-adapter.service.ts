import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Contract, JsonRpcProvider } from 'ethers';

interface Erc20Contract {
  name(): Promise<string>;
  symbol(): Promise<string>;
  totalSupply(): Promise<bigint>;
  balanceOf(account: string): Promise<bigint>;
}

@Injectable()
export class BlockchainAdapterService {
  private readonly provider: JsonRpcProvider;
  private readonly usdcContract: Erc20Contract;

  private readonly usdcAddress = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';

  private readonly erc20Abi = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address account) view returns (uint256)',
  ];

  constructor(private readonly configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('SEPOLIA_RPC_URL');

    if (!rpcUrl) {
      throw new InternalServerErrorException(
        'La variable SEPOLIA_RPC_URL no está configurada.',
      );
    }

    this.provider = new JsonRpcProvider(rpcUrl);

    this.usdcContract = new Contract(
      this.usdcAddress,
      this.erc20Abi,
      this.provider,
    ) as unknown as Erc20Contract;
  }

  async getTokenInfo() {
    const name = await this.usdcContract.name();
    const symbol = await this.usdcContract.symbol();
    const totalSupply = await this.usdcContract.totalSupply();

    return {
      network: 'Ethereum Sepolia',
      contractAddress: this.usdcAddress,
      name,
      symbol,
      totalSupply: totalSupply.toString(),
    };
  }
}
