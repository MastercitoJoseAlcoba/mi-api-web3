import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainAdapterService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;

  constructor(private readonly configService: ConfigService) {
    const alchemyUrl = this.configService.get<string>('ALCHEMY_URL');
    const privateKey = this.configService.get<string>('PRIVATE_KEY');

    if (!alchemyUrl) {
      throw new Error('Falta ALCHEMY_URL en el archivo .env');
    }

    if (!privateKey) {
      throw new Error('Falta PRIVATE_KEY en el archivo .env');
    }

    this.provider = new ethers.JsonRpcProvider(alchemyUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
  }

  getWallet() {
    return {
      address: this.signer.address,
      signer: 'ethers.Wallet conectado a Sepolia',
    };
  }

  async getBalance() {
    try {
      const balanceWei = await this.provider.getBalance(this.signer.address);
      const balanceEth = ethers.formatEther(balanceWei);

      return {
        address: this.signer.address,
        balance: balanceEth,
        unit: 'Sepolia ETH',
      };
    } catch (error) {
      console.error('Error al obtener balance:', error);

      const mensajeError =
        error instanceof Error ? error.message : 'Error desconocido';

      return {
        error: 'No se pudo obtener el balance',
        detalle: mensajeError,
      };
    }
  }

  async transfer(to: string, amount: string) {
    try {
      if (!to) {
        return {
          error: 'Falta la dirección destino',
        };
      }

      if (!amount) {
        return {
          error: 'Falta el monto a enviar',
        };
      }

      console.log('Preparando transferencia...');
      console.log('From:', this.signer.address);
      console.log('To:', to);
      console.log('Amount:', amount, 'Sepolia ETH');

      // Primera promesa: la transacción entra a la Mempool
      const tx = await this.signer.sendTransaction({
        to: to,
        value: ethers.parseEther(amount),
      });

      console.log('Transacción enviada a la Mempool');
      console.log('TxHash:', tx.hash);

      // Segunda promesa: esperar a que el bloque sea minado
      const receipt = await tx.wait();

      console.log('Transacción minada');
      console.log('Block Number:', receipt?.blockNumber);
      console.log('Status:', receipt?.status);

      return {
        mensaje: 'Transferencia realizada correctamente',
        txHash: tx.hash,
        etherscanUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`,
        receipt: {
          status: receipt?.status,
          blockNumber: receipt?.blockNumber,
          from: receipt?.from,
          to: receipt?.to,
          gasUsed: receipt?.gasUsed?.toString(),
          hash: receipt?.hash,
        },
      };
    } catch (error: any) {
      console.error('Error al transferir:', error);

      let detalle = 'Error desconocido';

      if (error instanceof Error) {
        detalle = error.message;
      }

      return {
        error: 'No se pudo realizar la transferencia',
        detalle: detalle,
      };
    }
  }
}
