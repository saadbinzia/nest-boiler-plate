import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidateInputPipe);
  app.enableCors({
    allowedHeaders: "*",
    origin: process.env['CORS'].split(',')
  });
  await app.listen(3000);
}
bootstrap();
