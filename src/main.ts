import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RapidAPIService } from './rapidapi/rapidapi.service';
import { OpenAIService } from './openai/openai.service';

interface Trends {
  name: string;
}

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const rapidAPIService = appContext.get(RapidAPIService);

  try {
    // First we get the trending data from RapidAPI
    const objectOfTrends = await rapidAPIService.getTrendingData();
    const trends: Trends[] = Object.values(objectOfTrends.trends);
    const arrayOfTrends = trends.map((value) => value.name);

    // Then we use the trending data to generate a prompt for OpenAI
    const openAIService = new OpenAIService();
    const prompt = await openAIService.generatePrompt(arrayOfTrends);

    // Then we use the prompt to generate an image from OpenAI
    const image_url = await openAIService.generateImage(prompt);
    console.log('image_url', image_url);

    // Then we publish the image to Twitter and Instagram
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
