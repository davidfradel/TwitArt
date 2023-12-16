import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RapidAPIService } from './rapidapi/rapidapi.service';
import { OpenAIService } from './openai/openai.service';
import { AyrshareService } from './ayrshare/ayrshare.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

interface Trends {
  name: string;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const schedulerRegistry = app.get(SchedulerRegistry);
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const rapidAPIService = appContext.get(RapidAPIService);
  const currentDate = new Date().toDateString();

  const job = new CronJob('0 */6 * * *', async () => {
    const appContext = await NestFactory.createApplicationContext(AppModule);

    try {
      // First we get the trending data from RapidAPI
      const objectOfTrends = await rapidAPIService.getTrendingData();
      const trends: Trends[] = Object.values(objectOfTrends.trends);
      const arrayOfTrends = trends.map((value) => value.name);

      // Then we use the trending data to generate a prompt for OpenAI
      const openAIService = new OpenAIService();
      const prompt = await openAIService.generatePrompt(arrayOfTrends);

      // Then we use the prompt to generate an image from OpenAI
      const imageUrl = await openAIService.generateImage(prompt);
      console.log('imageUrl', imageUrl);

      // Then we publish the image to Twitter and Instagram
      const ayrshareService = new AyrshareService();
      await ayrshareService.addPicture(imageUrl, currentDate);
      console.log(`We're done! --- ${currentDate}`);
    } catch (error) {
      console.error('Error:', error);
    }

    await appContext.close();
  });

  schedulerRegistry.addCronJob('myCronJob', job);
  job.start();

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
