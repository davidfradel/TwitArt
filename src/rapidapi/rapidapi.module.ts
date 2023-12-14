import { Module } from '@nestjs/common';
import { RapidAPIService } from './rapidapi.service';

@Module({
  providers: [RapidAPIService],
  exports: [RapidAPIService],
})
export class RapidAPIModule {}
