import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query, Request, UseGuards, UsePipes } from '@nestjs/common';
import { UUIDPipeOptions } from 'src/shared/constants/uuid-pipe-options.constant';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { TicketsService } from './tickets.service';
import { CreateTicketReqDto } from './dto/requests/create-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(AuthTokenGuard)
  async createTicket(@Body() dto: CreateTicketReqDto, @Request() req: AuthRequest) {
    const createdTicket = await this.ticketsService.createTicket({ ...dto, ticketUserId: req.user.userId });

    return {
      data: createdTicket,
    };
  }
}
