import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private queueService: QueueService) {}

  @Post()
  create(@Body() body: { patientName: string; queueNumber: number; appointmentId?: number }) {
    return this.queueService.create(body);
  }

  @Get()
  findAll() {
    return this.queueService.findAll();
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.queueService.updateStatus(+id, body.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queueService.remove(+id);
  }
}
