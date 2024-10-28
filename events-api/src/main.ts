import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './shared/configs/env.config';
import { ValidationConfig } from './shared/configs/validation.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<EnvConfig>);

  app.useGlobalPipes(ValidationConfig);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = configService.getOrThrow('APP_PORT', {
    infer: true,
  });

  await app.listen(port);
}
bootstrap();
