import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Param, Post, Body } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:url')
  async getUrl(@Param('url') param): Promise<string> {
    return await this.appService.getUrl(param);
  }

  @Post('/')
  async generateShortUrl(@Body() body): Promise<string> {
    const long_url = await this.appService.generateShortUrl(body.url);
    return await this.appService.insertUrl(long_url, body.url);
  }
}
