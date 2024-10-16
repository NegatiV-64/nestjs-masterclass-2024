import { CreateTicketReqDto } from './dto/create-ticket.dto';
import { DatabaseService } from './../database/database.service';
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class TicketsService {
  constructor(private readonly databaseService:DatabaseService){}

  async createTicket(userId:string, dto:CreateTicketReqDto){
    const isValidEvent = await this.databaseService.event.findFirst({
      where: {
        eventId: dto.ticketEventId
      }
    })

    if (!isValidEvent) {
      throw new BadRequestException(`Event with id ${dto.ticketEventId} not found`);
    }

    const createdTicket = await this.databaseService.ticket.create({
      data: {
        ticketQuantity: dto.ticketQuantity,
        ticketPrice: dto.ticketPrice,
        ticketEventId: dto.ticketEventId,
        ticketUserId: userId
      }
    })

    return createdTicket
  }

  async getUserTickets(userId:string) {
    const tickets = await this.databaseService.ticket.findMany({
      where: {
        ticketUserId: userId
      }
    });

    return tickets;
  }

  async getUserTicketById(userId:string, ticketId:string) {
    const ticket = await this.databaseService.ticket.findFirst({
      where: {
        ticketUserId: userId,
        ticketId,
      }
    })

    if (!ticket) {
      throw new BadRequestException(`Ticket with id ${ticketId} not found`)
    }

    return ticket
  }
}