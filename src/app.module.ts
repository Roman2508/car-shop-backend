import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { FilesModule } from './files/files.module';
import { FileEntity } from './files/entities/file.entity';
import { MessagesModule } from './messages/messages.module';
import { DialogsModule } from './dialogs/dialogs.module';
import { DialogEntity } from './dialogs/entities/dialog.entity';
import { MessageEntity } from './messages/entities/message.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AdvertisementModule } from './advertisement/advertisement.module';
import { UserModule } from './user/user.module';
import { AdvertisementEntity } from './advertisement/entities/advertisement.entity';
import { UserEntity } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [FileEntity, DialogEntity, MessageEntity, AdvertisementEntity, UserEntity],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    FilesModule,
    DialogsModule,
    MessagesModule,
    AdvertisementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
