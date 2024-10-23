import { TicketsService } from './tickets.service';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { Body, Controller, Post, UseGuards, Get, Param, Delete, Put } from '@nestjs/common';
import { CreateTicketDto } from './dto/requests/create-ticket.dto';
import { PayTicketDto } from './dto/requests/pay-ticket.dto';
import { User } from 'src/shared/decorators/user.decorator';
import { UUIDParam } from 'src/shared/decorators/uuid-param.decorator';
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @Post()
  @UseGuards(AuthTokenGuard)
  async createTicket(@Body() createTicketDto: CreateTicketDto, @User() user) {
    const createTicket = await this.ticketService.createTickets(createTicketDto, user.userId);

    return {
      data: createTicket,
    };
  }

  @Get()
  @UseGuards(AuthTokenGuard)
  async getUserTickets(@User() user) {
    const tickets = await this.ticketService.getUserTickets(user.userId);

    return {
      data: tickets,
    };
  }

  @Get(':ticketId')
  @UseGuards(AuthTokenGuard)
  async getTicketById(@UUIDParam('ticketId') ticketId: string, @User() user) {
    const foundTicket = await this.ticketService.getTicketById(ticketId, user.userId);

    return {
      data: foundTicket,
    };
  }

  @Delete('ticketId')
  @UseGuards(AuthTokenGuard)
  async deleteTicket(@UUIDParam('ticketId') ticketId: string, @User() user) {
    await this.ticketService.deleteTicket(ticketId, user.userId);

    return {
      message: 'Ticket deleted successfully',
    };
  }

  @UseGuards(AuthTokenGuard)
  @Put(':id/pay')
  async payForTicket(@Param('id') ticketId: string, @Body() dto: PayTicketDto, @User() user) {
    return this.ticketService.payForTicket(ticketId, user.userId, dto);
  }

  @UseGuards(AuthTokenGuard)
  @Put(':id/cancel')
  async cancelTicket(@Param('id') ticketId: string, @User() user) {
    return this.ticketService.cancelTicket(ticketId, user.userId);
  }
}
