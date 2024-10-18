import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PaymentDto, type CreateTicketReqDto } from './dto/requests';
import { TicketStatus } from 'src/shared/constants/ticket-status.constant';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class TicketsService {
    constructor(private readonly databaseService: DatabaseService, private readonly paymentService: PaymentService) {}

    async createTicket(dto: CreateTicketReqDto, ticketUserId: string) {
        const eventId = await this.databaseService.event.findUnique({
            where: {
                eventId: dto.ticketEventId
            },
            select: {
                eventId: true
            }
        })
        if(!eventId) {
            throw new BadRequestException(`Event with id ${dto.ticketEventId} does not exist`);
        }

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

        if(!ticket) {
            throw new BadRequestException(`Ticket with id ${ticketId} does not exist or belong to this user`);
        }
        return ticket
    }

    async payForTicket(ticketId: string, dto: PaymentDto, userId: string) {
        const ticket = this.databaseService.ticket.findUnique({
            where: {
                ticketUserId: userId,
                ticketId: ticketId
            }
        })

        if(!ticket) {
            throw new BadRequestException(`Ticket with id ${ticketId} does not exist or belong to this user`);
        }
        
        const transactionId = await this.paymentService.paymentProcess(dto)
        const updatedTicket = await this.databaseService.ticket.update({
            where: { ticketId: ticketId },
            data: {ticketTransactionId: transactionId, ticketStatus: TicketStatus.Paid}
            
        })
        return updatedTicket;
    }

    async cancelTicket(ticketId: string, userId: string) {
        const ticket = this.databaseService.ticket.findUnique({
            where: {
                ticketUserId: userId,
                ticketId: ticketId
            }
        })

        if(!ticket) {
            throw new BadRequestException(`Ticket with id ${ticketId} does not exist or belong to this user`);
        }
        const canceledTicket = await this.databaseService.ticket.update({
            where: {ticketId: ticketId},
            data: {ticketStatus: TicketStatus.Cancelled}
        })
        return canceledTicket;
    }
}
