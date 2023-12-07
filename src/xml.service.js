import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Client } from 'pg';
import { Cheerio } from 'cheerio';

@Injectable()
class XmlService {
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
  @Cron(CronExpression.EVERY_MINUTE)
  async crawlSites() {
    const sites = await this.client.query('SELECT * FROM url_shortener.sites');
    sites.rows.forEach(async (site) => {
      const response = await fetch(site.url);
      const text = await response.text();
      const $ = Cheerio.load(text);
      const title = $('title').text();
      await this.client.query('UPDATE sites SET title = $1 WHERE id = $2', [
        title,
        site.id,
      ]);
    });
  }
}
module.exports = XmlService;
