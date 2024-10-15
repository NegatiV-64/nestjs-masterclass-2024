import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './shared/configs/env.config';
import { ValidationConfig } from './shared/configs/validation.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<EnvConfig>);

  app.useGlobalPipes(ValidationConfig);

  const port = configService.getOrThrow('APP_PORT', {
    infer: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Ticketing API')
    .setDescription('API for managing tickets').
    setVersion('1.0').addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
bootstrap();
