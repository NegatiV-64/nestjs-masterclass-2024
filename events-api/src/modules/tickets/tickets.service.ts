import { CreateTicketReqDto } from './dto/create-ticket.dto';
import { DatabaseService } from './../database/database.service';
import { BadRequestException, Injectable } from "@nestjs/common";
import { PayTicketReqDto } from './dto/payment-ticket.dto';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class TicketsService {
  constructor(
    private readonly databaseService:DatabaseService,
    private readonly paymentService: PaymentService
  ){}

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

  async payTicket(userId:string, ticketId:string, dto: PayTicketReqDto) {
    const ticket = await this.databaseService.ticket.findFirst({
      where: {
        ticketId,
        ticketUserId: userId
      }
    })

    if (!ticket) {
      throw new BadRequestException(`Ticket with id ${ticketId} and owner id ${userId} not found`)
    }

    const paymentData = {
      last4:  dto.last4Digits,
      expiration: dto.cardExpiry,
      cardholder: dto.cardHolderName,
      amount: dto.paymentAmount,
      paymentToken: dto.paymentToken
    }

    const paymentResult = await this.paymentService.payingProcess(paymentData);
    await this.databaseService.ticket.update({
      where: {
        ticketId,
      },
      data: {
        ticketTransactionId: paymentResult.transactionId,
        ticketStatus: 'paid'
      }
    })

    return paymentResult
  }

  async cancelTicket(userId:string, ticketId:string) {
    const ticket = await this.databaseService.ticket.findFirst({
      where: {
        ticketId,
        ticketUserId: userId
      }
    })

    if (!ticket) {
      throw new BadRequestException(`Ticket with id ${ticketId} and owner id ${userId} not found`)
    }

    const cancelledTicket = await this.databaseService.ticket.update({
      where: {
        ticketId,
      },
      data: {
        ticketStatus: 'cancelled'
      }
    })

    return cancelledTicket
  }
}