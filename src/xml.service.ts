import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Client } from 'pg';
import Cheerio from 'cheerio';

@Injectable()
export class XmlService {
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
  @Cron(CronExpression.EVERY_10_SECONDS)
  async crawlSites() {
    const sites = await this.client.query('SELECT * FROM urls');
    sites.rows.forEach(async (site: { long_url: string; id: any }) => {
      const url =
        site.long_url.indexOf('http') === 0
          ? site.long_url
          : `http://${site.long_url}`;
      const response = await fetch(url);
      const text = await response.text();
      const $ = Cheerio.load(text);
      const title = $('title').text();
      await this.client.query('UPDATE urls SET title = $1 WHERE id = $2', [
        title,
        site.id,
      ]);
    });
  }
}
