import { Module } from '@nestjs/common';

import { VinylRecordsController } from './vinyl-records.controller';
import { VinylRecordsService } from './vinyl-records.service';

@Module({
  controllers: [VinylRecordsController],

  providers: [VinylRecordsService],
})
export class VinylRecordsModule {}
