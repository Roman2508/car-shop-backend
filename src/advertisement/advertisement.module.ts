import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DialogsModule } from 'src/dialogs/dialogs.module';
import { AdvertisementService } from './advertisement.service';
import { AdvertisementController } from './advertisement.controller';
import { AdvertisementEntity } from './entities/advertisement.entity';

@Module({
  controllers: [AdvertisementController],
  providers: [AdvertisementService],
  imports: [TypeOrmModule.forFeature([AdvertisementEntity]), DialogsModule],
})
export class AdvertisementModule {}
