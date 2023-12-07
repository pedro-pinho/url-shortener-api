import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  private client: Client;
  constructor() {
    this.client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'url-shortener',
      password: 'password',
      port: 5454,
    });
    this.client.connect();
  }
  async getUrl(url: string): Promise<string> {
    const result = await this.client.query(
      'SELECT long_url FROM urls WHERE short_url = $1',
      [url],
    );
    return result?.rows[0]?.long_url;
  }
  async checkUrl(url: string): Promise<boolean> {
    const result = await this.client.query(
      'SELECT 1 FROM urls WHERE short_url = $1',
      [url],
    );
    return result?.rows?.length > 0;
  }
  async generateShortUrl(long_url: string): Promise<string> {
    const short_url = uuidv4();
    if (await this.checkUrl(short_url)) {
      return this.generateShortUrl(long_url);
    }
    return short_url;
  }
  insertUrl(long_url: string, short_url: string): Promise<any> {
    const result = this.client.query(
      'INSERT INTO urls (long_url, short_url) VALUES ($1, $2)',
      [long_url, short_url],
    );
    return result;
  }
}
