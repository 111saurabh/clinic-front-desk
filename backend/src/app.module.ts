import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { QueueModule } from './queue/queue.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '18213859',
      database: 'clinicdb', // we'll create this next
      autoLoadEntities: true,
      synchronize: true, // ✅ for dev only
      
    }),
    UserModule,
    DoctorModule,
    AppointmentModule,
    QueueModule,
    AuthModule,
  ],
})
export class AppModule {}
