import { DocumentBuilder } from "@nestjs/swagger";

export const config = new DocumentBuilder().setTitle('Ticketing API').setDescription('API for managing tickets').setVersion('1.0').addBearerAuth().build();