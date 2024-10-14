import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTicketDto } from './dto/create-ticket-dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TicketsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly httpService: HttpService,
  ) {}

  async createTicket(createTicketDto: CreateTicketDto, userId: string): Promise<CreateTicketDto> {
    try {
      if (createTicketDto.ticketQuantity <= 0) {
        throw new BadRequestException('Ticket quantity must be greater than zero');
      }
      if (createTicketDto.ticketPrice <= 0) {
        throw new BadRequestException('Ticket price must be greater than zero');
      }

      const existingEvent = await this.databaseService.event.findUnique({
        where: { eventId: createTicketDto.ticketEventId },
      });

      if (!existingEvent) {
        throw new BadRequestException('Event not found');
      }

      const createdTicket = await this.databaseService.ticket.create({
        data: {
          ticketPrice: createTicketDto.ticketPrice,
          ticketQuantity: createTicketDto.ticketQuantity,
          ticketEventId: createTicketDto.ticketEventId,
          ticketUserId: userId,
        },
      });

      return createdTicket;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error creating ticket');
    }
  }
  async getAllTicketsByUserId(userId: string) {
    try {
      return await this.databaseService.ticket.findMany({
        where: { ticketUserId: userId },
      });
    } catch (error) {
      throw new Error('Error fetching tickets');
    }
  }

  async getOneTicketOfUser(userId: string) {
    try {
      return await this.databaseService.ticket.findFirst({
        where: {
          ticketUserId: userId,
          },
          take: 1
      });
    } catch (error) {
      throw new Error('Error fetching ticket');
    }
  }
  async payForTicket(ticketId: string, userId: string, paymentDetails: CreatePaymentDto) {
    const ticket = await this.databaseService.ticket.findFirst({
      where: {
        ticketId,
        ticketUserId: userId,
      },
    });

    if (!ticket) {
      throw new BadRequestException('Ticket not found or not owned by the user');
    }

    const { last4Digits, cardExpiry, cardHolderName, paymentToken, paymentAmount } = paymentDetails;

    if (!last4Digits || !cardExpiry || !cardHolderName || !paymentToken || !paymentAmount) {
      throw new BadRequestException('All fields are required');
    }
    console.log(paymentToken);

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          'http://localhost:3030/payment', // Payment API URL from .env
          {
            last4: last4Digits,
            expiration: cardExpiry,
            cardholder: cardHolderName,
            amount: paymentAmount,
            paymentToken: paymentToken,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
          },
        ),
      );

      if (response) {
        return response.data;
      } else {
        throw new HttpException('Payment failed', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.log(error.response.data);
      throw new BadRequestException('Payment API call failed', error.response?.data || error.message);
    }
  }
  async cancelTicket(ticketId: string, userId: string) {
    try {
      const ticket = await this.databaseService.ticket.findFirst({
        where: {
          ticketId,
          ticketUserId: userId,
        },
      });

      if (!ticket) {
        throw new BadRequestException('Ticket not found or not owned by the user');
      }

      await this.databaseService.ticket.update({
        where: {
          ticketId,
        },
        data: {
          ticketStatus: 'cancelled',
        },
      });

      return { message: 'Ticket canceled successfully' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
