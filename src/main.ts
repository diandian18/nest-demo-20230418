import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { HttpExceptionFilter } from '@/common/filters/httpException.filter';
import winston, {createLogger, format, transports} from 'winston';
import {WinstonModule, utilities as nestWinstonModuleUtilities} from 'nest-winston';
import * as path from 'path';
import {isEnvLocal, isLocal} from './common/utils/env';
import {winstonInstance} from './log';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: winstonInstance,
    }),
  });
  // app.useGlobalFilters(new HttpExceptionFilter())
  app.enableShutdownHooks();
  await app.listen(3000);
}

bootstrap();

