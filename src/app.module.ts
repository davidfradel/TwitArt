import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RapidAPIModule } from './rapidapi/rapidapi.module';
import { OpenAIModule } from './openai/openai.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [RapidAPIModule, OpenAIModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
