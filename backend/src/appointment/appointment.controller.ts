import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointment')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Post()
  create(@Body() body: { patientName: string; date: string; time: string; doctorId: number }) {
    return this.appointmentService.create(body);
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.appointmentService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(+id);
  }

  // ✅ New reschedule route
  @Put(':id/reschedule')
  reschedule(
    @Param('id') id: string,
    @Body('date') date: string,
    @Body('time') time: string,
    @Body('doctorId') doctorId: number,
  ) {
    return this.appointmentService.reschedule(+id, date, time, doctorId);
  }
}
