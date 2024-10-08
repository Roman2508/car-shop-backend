import * as passport from 'passport';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'keyword',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // app.enableCors({ credentials: false, origin: true });

  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'https://shop-client-ijcw.onrender.com',
    ],
  });

  const config = new DocumentBuilder()
    .setTitle('Аква термикс')
    .setDescription('api documentation')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(5000);
}

bootstrap();
