import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor.entity';

@Controller('doctor')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Post()
  create(@Body() doctor: Partial<Doctor>) {
    return this.doctorService.create(doctor);
  }

  @Get()
  findAll() {
    return this.doctorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() doctor: Partial<Doctor>) {
    return this.doctorService.update(+id, doctor);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.doctorService.delete(+id);
  }
}
