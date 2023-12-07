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
    const short_url = await this.appService.generateShortUrl(body.url);
    const result = await this.appService.insertUrl(body.url, short_url);
    if (result) {
      return short_url;
    }
    throw new Error('Error generating short url');
  }
}
