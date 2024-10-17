import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { type CreateTicketReqDto } from './dto/requests';
import { TicketStatus } from 'src/shared/constants/ticket-status.constant';

@Injectable()
export class TicketsService {
    constructor(private readonly databaseService: DatabaseService) {}

    async createTicket(dto: CreateTicketReqDto, ticketUserId: string) {
        const createdTicket = await this.databaseService.ticket.create({
            data: {
                ticketStatus: TicketStatus.Pending,
                ticketUserId: ticketUserId,
                ticketQuantity: dto.ticketQuantity,
                ticketPrice: dto.ticketPrice,
                ticketEventId: dto.ticketEventId
            }
        })
        return createdTicket;
    }
    
    async allTickets(userId: string) {
        const tickets = await this.databaseService.ticket.findMany({
            where: {
                ticketUserId: userId
            }
        })
        return tickets;
    }

    async getTicketById(userId: string, ticketId: string) {
        const ticket = this.databaseService.ticket.findUnique({
            where: {
                ticketUserId: userId,
                ticketId: ticketId
            }
        })
        return ticket
    }
}
