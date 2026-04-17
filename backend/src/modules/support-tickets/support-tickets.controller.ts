import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SupportTicketsService } from './support-tickets.service';
import { TicketStatus } from '../../entities/support-ticket.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('support-tickets')
export class SupportTicketsController {
  constructor(private ticketsService: SupportTicketsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('status') status?: TicketStatus) {
    return this.ticketsService.findAll(status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats() {
    return this.ticketsService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: any) {
    return this.ticketsService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.ticketsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: TicketStatus) {
    return this.ticketsService.updateStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/assign')
  async assignTicket(@Param('id') id: string, @Body('assignedTo') assignedTo: string) {
    return this.ticketsService.assignTicket(id, assignedTo);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
