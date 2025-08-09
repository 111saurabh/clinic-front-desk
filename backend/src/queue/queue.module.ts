import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './queue.entity';
import { Appointment } from '../appointment/appointment.entity';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Queue, Appointment]), // ✅ Add Appointment here
  ],
  providers: [QueueService],
  controllers: [QueueController],
})
export class QueueModule {}
