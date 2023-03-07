import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap(applicationPort) {
  const app = await NestFactory.create(AppModule);
  await app.listen(applicationPort);
  return app
}
bootstrap(process.env.APPLICATION_PORT);
