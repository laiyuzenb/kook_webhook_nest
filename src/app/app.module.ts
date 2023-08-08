import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from 'src/app/app.controller';
import { AppService } from 'src/app/app.service';
import { Queue_Service } from 'src/queue/queue.service';

@Module({
  imports: [
    // 定时任务模块
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, Queue_Service],
})
export class AppModule {}
