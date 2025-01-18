import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Nestjs Starter API')
  .setDescription('Starter Kit API description')
  .setVersion('1.0')
  .build();
