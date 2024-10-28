import { Controller, Post, Get, Put, Param, Body, Request, UseGuards, Patch } from '@nestjs/common';
import { TicketsService } from './ticket.service';
import { CreateTicketDto, PayTicketDto } from './dto';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';

@Controller('tickets')
@UseGuards(AuthTokenGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}
  @Post()
  createTicket(@Body() data: any, @Request() req) {
    console.log('Raw request data:', data);
    return this.ticketsService.createTicket(data, req.user.userId);
  }

  @Get()
  getUserTickets(@Request() req) {
    return this.ticketsService.getUserTickets(req.user.userId);
  }

  @Get(':id')
  getTicketById(@Param('id') ticketId: string, @Request() req) {
    return this.ticketsService.getTicketById(ticketId, req.user.userId);
  }

  @Patch(':id/pay')
  payTicket(@Param('id') ticketId: string, @Body() data: PayTicketDto, @Request() req) {
    return this.ticketsService.payTicket(ticketId, req.user.userId, data);
  }

  @Patch(':id/cancel')
  cancelTicket(@Param('id') ticketId: string, @Request() req) {
    return this.ticketsService.cancelTicket(ticketId, req.user.userId);
  }
}
