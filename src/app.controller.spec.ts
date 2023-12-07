import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return the URL', async () => {
      // Arrange
      const param = 'e9f15a90-66d9-4f66-9b5f-df272edaebcf';
      const expectedUrl = 'www.google.com';

      // Act
      const result = await appController.getUrl(param);

      // Assert
      expect(result).toBe(expectedUrl);
    });
    it('should generate a short URL and insert it into the database', async () => {
      // Arrange
      const body = { url: 'www.example.com' };
      const expectedShortUrl = 'short-url';

      jest
        .spyOn(appService, 'generateShortUrl')
        .mockResolvedValue(expectedShortUrl);
      jest.spyOn(appService, 'insertUrl').mockResolvedValue(true);

      // Act
      const result = await appController.generateShortUrl(body);

      // Assert
      expect(result).toBe(expectedShortUrl);
      expect(appService.generateShortUrl).toHaveBeenCalledWith(body.url);
      expect(appService.insertUrl).toHaveBeenCalledWith(
        body.url,
        expectedShortUrl,
      );
    });

    it('should throw an error if there is an error generating the short URL', async () => {
      // Arrange
      const body = { url: 'www.example.com' };

      jest
        .spyOn(appService, 'generateShortUrl')
        .mockRejectedValue(new Error('Error generating short url'));

      // Act and Assert
      await expect(appController.generateShortUrl(body)).rejects.toThrowError(
        'Error generating short url',
      );
      expect(appService.generateShortUrl).toHaveBeenCalledWith(body.url);
    });

    it('should throw an error if there is an error inserting the URL into the database', async () => {
      // Arrange
      const body = { url: 'www.example.com' };
      const expectedShortUrl = 'short-url';

      jest
        .spyOn(appService, 'generateShortUrl')
        .mockResolvedValue(expectedShortUrl);
      jest.spyOn(appService, 'insertUrl').mockResolvedValue(false);

      // Act and Assert
      await expect(appController.generateShortUrl(body)).rejects.toThrowError(
        'Error generating short url',
      );
      expect(appService.generateShortUrl).toHaveBeenCalledWith(body.url);
      expect(appService.insertUrl).toHaveBeenCalledWith(
        body.url,
        expectedShortUrl,
      );
    });
  });
});
