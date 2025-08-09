import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from './queue.entity';
import { Appointment } from '../appointment/appointment.entity';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepo: Repository<Queue>,

    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  async create(data: { patientName: string; appointmentId?: number }) {
    let appointment: Appointment | undefined;

    if (data.appointmentId) {
      const found = await this.appointmentRepo.findOne({
        where: { id: data.appointmentId },
        relations: ['doctor'],
      });

      appointment = found ?? undefined; // ✅ convert null to undefined

      if (!appointment) {
        throw new NotFoundException(`Appointment with ID ${data.appointmentId} not found`);
      }
    }

    // Get the last queue number
    const lastQueue = await this.queueRepo.find({
      order: { queueNumber: 'DESC' },
      take: 1,
    });
    const nextQueueNumber = lastQueue.length > 0 ? lastQueue[0].queueNumber + 1 : 1;

    const queueEntry = this.queueRepo.create({
      patientName: data.patientName,
      queueNumber: nextQueueNumber,
      status: 'waiting',
      appointment,
    });

    return this.queueRepo.save(queueEntry);
  }

  findAll() {
    return this.queueRepo.find();
  }

  async updateStatus(id: number, status: string) {
    const queueEntry = await this.queueRepo.findOne({ where: { id } });
    if (!queueEntry) {
      throw new NotFoundException(`Queue entry with ID ${id} not found`);
    }
    queueEntry.status = status;
    return this.queueRepo.save(queueEntry);
  }

  async remove(id: number) {
    const queueEntry = await this.queueRepo.findOne({ where: { id } });
    if (!queueEntry) {
      throw new NotFoundException(`Queue entry with ID ${id} not found`);
    }
    return this.queueRepo.remove(queueEntry);
  }
}
