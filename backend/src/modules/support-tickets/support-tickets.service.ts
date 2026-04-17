import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket, TicketStatus, TicketPriority } from '../../entities/support-ticket.entity';

@Injectable()
export class SupportTicketsService {
  constructor(
    @InjectRepository(SupportTicket)
    private ticketsRepository: Repository<SupportTicket>,
  ) {}

  async findAll(status?: TicketStatus): Promise<SupportTicket[]> {
    const where = status ? { status } : {};
    return this.ticketsRepository.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<SupportTicket> {
    const ticket = await this.ticketsRepository.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async create(data: Partial<SupportTicket>): Promise<SupportTicket> {
    const ticket = this.ticketsRepository.create(data);
    return this.ticketsRepository.save(ticket);
  }

  async update(id: string, data: Partial<SupportTicket>): Promise<SupportTicket> {
    await this.ticketsRepository.update(id, data);
    return this.findOne(id);
  }

  async updateStatus(id: string, status: TicketStatus): Promise<SupportTicket> {
    return this.update(id, { status });
  }

  async assignTicket(id: string, assignedTo: string): Promise<SupportTicket> {
    return this.update(id, { assignedTo, status: TicketStatus.IN_PROGRESS });
  }

  async remove(id: string): Promise<void> {
    const result = await this.ticketsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Ticket not found');
  }

  async getStats(): Promise<any> {
    const all = await this.ticketsRepository.find();
    return {
      total: all.length,
      open: all.filter(t => t.status === TicketStatus.OPEN).length,
      inProgress: all.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
      escalated: all.filter(t => t.status === TicketStatus.ESCALATED).length,
      resolved: all.filter(t => t.status === TicketStatus.RESOLVED).length,
      closed: all.filter(t => t.status === TicketStatus.CLOSED).length,
      byPriority: {
        critical: all.filter(t => t.priority === TicketPriority.CRITICAL).length,
        high: all.filter(t => t.priority === TicketPriority.HIGH).length,
        medium: all.filter(t => t.priority === TicketPriority.MEDIUM).length,
        low: all.filter(t => t.priority === TicketPriority.LOW).length,
      },
    };
  }
}
