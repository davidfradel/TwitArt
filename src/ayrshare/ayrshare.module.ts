import { Module } from '@nestjs/common';
import { AyrshareService } from './ayrshare.service';

@Module({
  providers: [AyrshareService],
  exports: [AyrshareService],
})
export class AyrshareModule {}
