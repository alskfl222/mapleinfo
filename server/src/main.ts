import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './modules/app.module';
import MongoUtil from './services/db.service'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await MongoUtil.init();
  app.enableCors();
  await app.listen(4000);
}

bootstrap();

process.on('SIGINT', async () => {
  console.log('DB CLOSE')
  await MongoUtil.client.close()
  process.exit(0)
})
