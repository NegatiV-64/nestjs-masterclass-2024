import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthTokenGuard } from '../../shared/guards/auth-token.guard';
import { CreateTicketDto } from './dto/create-ticket-dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @UseGuards(AuthTokenGuard)
  @Post()
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.createTicket(createTicketDto);
  }

  @UseGuards(AuthTokenGuard)
  @Get()
  async getAllTickets(@Request() req) {
    const userId = req.user.id;
    return this.ticketService.getAllTicketsByUserId(userId);
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  async getTicketById(@Param('id') ticketId: string, @Request() req) {
    const userId = req.user.id;
    const ticket = await this.ticketService.getTicketById(ticketId, userId);

    if (!ticket) {
      throw new BadRequestException('Ticket not found or does not belong to the authenticated user');
    }

    return ticket;
  }

  @Put(':id/pay')
  @UseGuards(AuthTokenGuard) // Protect this route
  async payForTicket(
    @Param('id') ticketId: string,
    @Body()
    createPaymentDto: CreatePaymentDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    const paymentResult = await this.ticketService.payForTicket(ticketId, userId, createPaymentDto);

    if (paymentResult) {
      return paymentResult;
    } else {
      throw new BadRequestException('Payment failed', paymentResult);
    }
  }

  @Put(':id/cancel')
  @UseGuards(AuthTokenGuard)
  async cancelTicket(@Param('id') ticketId: string, @Request() req) {
    const userId = req.user.id;
    const cancellationResult = await this.ticketService.cancelTicket(ticketId, userId);

    if (cancellationResult) {
      return cancellationResult;
    } else {
      throw new BadRequestException('Ticket cancellation failed', cancellationResult);
    }
  }
}
