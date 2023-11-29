import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonInstance } from './log';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: winstonInstance,
    }),
    cors: true,
  });
  // app.useGlobalFilters(new HttpExceptionFilter())
  app.enableShutdownHooks();

  await app.listen(3000);
}

bootstrap();
