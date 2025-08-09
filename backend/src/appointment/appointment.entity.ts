import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientName: string;

  @Column()
  date: string; // Format: YYYY-MM-DD

  @Column()
  time: string; // Format: HH:MM

  @Column({ default: 'booked' }) // booked, completed, canceled
  status: string;

  @ManyToOne(() => Doctor, { eager: true })
  doctor: Doctor;
}
