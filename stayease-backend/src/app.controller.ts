import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiApp, ApiGetHello } from './app.swagger';

@ApiApp('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiGetHello()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
