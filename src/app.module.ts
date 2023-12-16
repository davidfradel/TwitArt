import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RapidAPIModule } from './rapidapi/rapidapi.module';
import { OpenAIModule } from './openai/openai.module';

@Module({
  imports: [RapidAPIModule, OpenAIModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
