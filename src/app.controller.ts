import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {

  @Get()
  getStatus() {
    return {
      message: 'API Web3 funcionando correctamente',
    };
  }
}