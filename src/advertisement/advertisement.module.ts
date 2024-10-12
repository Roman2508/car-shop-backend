import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdvertisementService } from './advertisement.service';
import { AdvertisementController } from './advertisement.controller';
import { AdvertisementEntity } from './entities/advertisement.entity';

@Module({
  controllers: [AdvertisementController],
  providers: [AdvertisementService],
  imports: [TypeOrmModule.forFeature([AdvertisementEntity])],
})
export class AdvertisementModule {}
