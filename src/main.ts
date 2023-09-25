import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { AppModule } from 'src/app/app.module';
import { get_config } from 'src/utils/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 提高body json 大小限制
  app.use(json({ limit: '10mb' }));

  // 设置全局路由前缀
  app.setGlobalPrefix('api');

  // 根据不同环境启动不同端口
  const port = get_config('port');

  await app.listen(port);
}

bootstrap();
