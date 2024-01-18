import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RapidAPIService } from './rapidapi/rapidapi.service';
import { OpenAIService } from './openai/openai.service';
import { AyrshareService } from './ayrshare/ayrshare.service';

interface Trends {
  name: string;
  domainContext: string;
}

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const rapidAPIService = appContext.get(RapidAPIService);
  const currentDate = new Date().toDateString();
  const ignoreList = ['Football'];

  try {
    // First we get the trending data from RapidAPI
    const objectOfTrends = await rapidAPIService.getTrendingData();
    const trends: Trends[] = Object.values(objectOfTrends.trends);
    const arrayOfTrends = trends
      .filter(
        (value) =>
          value.domainContext &&
          value.domainContext.length > 0 &&
          !ignoreList.includes(value.domainContext),
      )
      .map((value) => value.name);

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
}

bootstrap();
