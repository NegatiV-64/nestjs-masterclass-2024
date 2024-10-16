import { TicketsService } from './tickets.service';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { Body, Controller, Post, UseGuards, Request, Get, Param, ParseUUIDPipe, HttpStatus, Delete, Req, Put } from '@nestjs/common';
import { CreateTicketDto } from './dto/requests/create-ticket.dto';
import { PayTicketDto } from './dto/requests/pay-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @Post()
  @UseGuards(AuthTokenGuard)
  async createTicket(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    const userId = req.user.userId;
    const createTicket = await this.ticketService.createTickets(createTicketDto, userId);

    return {
      data: createTicket,
    };
  }

  @Get()
  @UseGuards(AuthTokenGuard)
  async getUserTickets(@Request() req) {
    const userId = req.user.userId;
    const tickets = await this.ticketService.getUserTickets(userId);

    return {
      data: tickets,
    };
  }

  @Get(':ticketId')
  @UseGuards(AuthTokenGuard)
  async getTicketById(
    @Param(
      'ticketId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    ticketId: string,
    @Request() req,
  ) {
    const userId = req.user.userId;
    const foundTicket = await this.ticketService.getTicketById(ticketId, userId);

    return {
      data: foundTicket,
    };
  }

  @Delete('ticketId')
  @UseGuards(AuthTokenGuard)
  async deleteTicket(
    @Param(
      'ticketId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    ticketId: string,
    @Request() req,
  ) {
    const userId = req.user.userId;
    await this.ticketService.deleteTicket(ticketId, userId);

    return {
      message: 'Ticket deleted successfully',
    };
  }

  @UseGuards(AuthTokenGuard)
  @Put(':id/pay')
  async payForTicket(@Param('id') ticketId: string, @Body() dto: PayTicketDto, @Req() req) {
    const userId = req.user.userId;
    return this.ticketService.payForTicket(ticketId, userId, dto);
  }

  @UseGuards(AuthTokenGuard)
  @Put(':id/cancel')
  async cancelTicket(@Param('id') ticketId: string, @Req() req) {
    const userId = req.user.userId;
    return this.ticketService.cancelTicket(ticketId, userId);
  }
}
