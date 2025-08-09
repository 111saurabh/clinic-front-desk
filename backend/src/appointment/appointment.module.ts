import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Queue } from '../queue/queue.entity'; // ✅ Import the entity
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Doctor, Queue]) // ✅ Add Queue here
  ],
  providers: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
