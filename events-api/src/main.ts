import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './shared/configs/env.config';
import { ValidationConfig } from './shared/configs/validation.config';
import { PrismaClientExceptionFilter } from './shared/filters/prisma-client-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const configService = app.get(ConfigService<EnvConfig>);

  app.useGlobalPipes(ValidationConfig);

  const port = configService.getOrThrow('APP_PORT', {
    infer: true,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(port);
}
bootstrap();
