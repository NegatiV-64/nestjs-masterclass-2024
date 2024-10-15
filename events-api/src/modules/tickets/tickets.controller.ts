import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthTokenGuard } from '../../shared/guards/auth-token.guard';
import { CreateTicketDto } from './dto/create-ticket-dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { User } from '../../shared/decorators/getUserId-from-request.decorator';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @UseGuards(AuthTokenGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateTicketDto })
  @Post()
  async createTicket(@Body() createTicketDto: CreateTicketDto, @User() userId: string) {
    return this.ticketService.createTicket(createTicketDto, userId);
  }

  @UseGuards(AuthTokenGuard)
  @Get()
  @ApiOperation({ summary: 'Get all tickets for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns a list of tickets.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getAllTickets(@User() userId: string) {
    return this.ticketService.getAllTicketsByUserId(userId);
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific ticket by its ID' })
  @ApiResponse({ status: 200, description: 'Returns the ticket details.' })
  @ApiResponse({ status: 400, description: 'Ticket not found or does not belong to the authenticated user.' })
  async getTicketById(@Param('id') ticketId: string) {
    const ticket = await this.ticketService.getOneTicketOfUser(ticketId);

    if (!ticket) {
      throw new BadRequestException('Ticket not found or does not belong to the authenticated user');
    }

    return ticket;
  }

  @Put(':id/pay')
  @UseGuards(AuthTokenGuard)
  @ApiOperation({ summary: 'Pay for a ticket' })
  @ApiResponse({ status: 200, description: 'Payment successful.' })
  @ApiResponse({ status: 400, description: 'Payment failed.' })
  @ApiBody({ type: CreatePaymentDto })
  async payForTicket(@Param('id') ticketId: string, @Body() createPaymentDto: CreatePaymentDto, @User() userId: string) {
    const paymentResult = await this.ticketService.payForTicket(ticketId, userId, createPaymentDto);

    if (paymentResult) {
      return paymentResult;
    } else {
      throw new BadRequestException('Payment failed', paymentResult);
    }
  }

  @Put(':id/cancel')
  @UseGuards(AuthTokenGuard)
  @ApiOperation({ summary: 'Cancel a ticket' })
  @ApiResponse({ status: 200, description: 'Ticket successfully canceled.' })
  @ApiResponse({ status: 400, description: 'Ticket cancellation failed.' })
  async cancelTicket(@Param('id') ticketId: string, @User() userId: string) {
    const cancellationResult = await this.ticketService.cancelTicket(ticketId, userId);

    if (cancellationResult) {
      return cancellationResult;
    } else {
      throw new BadRequestException('Ticket cancellation failed', cancellationResult);
    }
  }
}
