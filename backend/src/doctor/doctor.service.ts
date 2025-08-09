import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  create(doctor: Partial<Doctor>) {
    const newDoctor = this.doctorRepo.create(doctor);
    return this.doctorRepo.save(newDoctor);
  }

  findAll() {
    return this.doctorRepo.find();
  }

  findOne(id: number) {
    return this.doctorRepo.findOne({ where: { id } });
  }

  update(id: number, doctor: Partial<Doctor>) {
    return this.doctorRepo.update(id, doctor);
  }

  delete(id: number) {
    return this.doctorRepo.delete(id);
  }
}
