import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('Events API')
  .setDescription('The Events API allows admins to manage events and users to manage their tickets')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
