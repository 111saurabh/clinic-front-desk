// queue.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Appointment } from '../appointment/appointment.entity';

@Entity()
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientName: string;

  @Column()
  queueNumber: number;

  @Column({ default: 'waiting' }) // waiting, with doctor, completed
  status: string;

  @ManyToOne(() => Appointment, { nullable: true, eager: true })
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;
}
