import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Queue } from '../queue/queue.entity'; // ✅ Added

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,

    @InjectRepository(Queue) // ✅ Added
    private queueRepo: Repository<Queue>,
  ) {}

  async create(data: { patientName: string; date: string; time: string; doctorId: number; queueId?: number }) {
    const doctor = await this.doctorRepo.findOne({ where: { id: data.doctorId } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${data.doctorId} not found`);
    }

    const appointment = this.appointmentRepo.create({
      patientName: data.patientName,
      date: data.date,
      time: data.time,
      status: 'booked',
      doctor,
    });

    const savedAppointment = await this.appointmentRepo.save(appointment);

    // 🔄 Link queue entry if provided
    if (data.queueId) {
      const queueEntry = await this.queueRepo.findOne({ where: { id: data.queueId } });
      if (queueEntry) {
        queueEntry.appointment = savedAppointment;
        queueEntry.status = 'with doctor';
        await this.queueRepo.save(queueEntry);
      }
    }

    return savedAppointment;
  }

  findAll() {
    return this.appointmentRepo.find({ relations: ['doctor'] });
  }

  async findOne(id: number) {
    const appointment = await this.appointmentRepo.findOne({ where: { id }, relations: ['doctor'] });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async update(id: number, body: any) {
    const appointment = await this.findOne(id);

    if (body.patientName !== undefined) appointment.patientName = body.patientName;
    if (body.date !== undefined) appointment.date = body.date;
    if (body.time !== undefined) appointment.time = body.time;
    if (body.status !== undefined) {
      appointment.status = body.status;

      // 🔄 Sync with queue
      const queueEntry = await this.queueRepo.findOne({ where: { appointment: { id } } });
      if (queueEntry) {
        queueEntry.status = body.status === 'completed' ? 'completed' : 'waiting';
        await this.queueRepo.save(queueEntry);
      }
    }

    if (body.doctorId !== undefined) {
      const doctor = await this.doctorRepo.findOne({ where: { id: body.doctorId } });
      if (!doctor) {
        throw new NotFoundException(`Doctor with ID ${body.doctorId} not found`);
      }
      appointment.doctor = doctor;
    }

    return this.appointmentRepo.save(appointment);
  }

  async remove(id: number) {
    const appointment = await this.findOne(id);
    return this.appointmentRepo.remove(appointment);
  }

  async reschedule(id: number, date: string, time: string, doctorId: number) {
    const appointment = await this.findOne(id);

    const doctor = await this.doctorRepo.findOne({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
    }

    appointment.date = date;
    appointment.time = time;
    appointment.doctor = doctor;

    return this.appointmentRepo.save(appointment);
  }
}
