import { BadRequestException, Injectable } from '@nestjs/common';
import { TicketsRepository } from './tickets.repository';
import { CreateTicketWithUser } from './types/create-ticket-with-user.type';
import { EventsRepository } from '../events/events.repository';

@Injectable()
export class TicketsService {
  constructor(
    private readonly ticketsRepository: TicketsRepository,
    private readonly eventsRepository: EventsRepository,
  ) {}

  async createTicket(dto: CreateTicketWithUser) {
    const event = await this.eventsRepository.getById(dto.ticketEventId);

    if (!event) {
      throw new BadRequestException(`Event with id ${dto.ticketEventId} not found`);
    }

    return await this.ticketsRepository.create(dto);
  }
}
