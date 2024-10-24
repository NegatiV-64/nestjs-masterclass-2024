import { Controller, Post, Body, UseGuards, Get, Param, Put } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketReqDto, TicketPaymentReqDto } from './dto/requests';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { User } from 'src/shared/decorators';
import { User as UserEntity } from '@prisma/client';
import { UUIDV4Pipe } from 'src/shared/pipes/parse-v4-uuid.pipe';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(AuthTokenGuard)
  async createTicket(@Body() createTicketDto: CreateTicketReqDto, @User() user: UserEntity) {
    const createdTicket = await this.ticketsService.createTicket(createTicketDto, user.userId);

    return {
      data: createdTicket,
    };
  }

  @Get()
  @UseGuards(AuthTokenGuard)
  async getTickets(@User() user: UserEntity) {
    const userTickets = await this.ticketsService.getTickets(user.userId);

    return {
      data: userTickets,
    };
  }

  @Get(':ticketId')
  @UseGuards(AuthTokenGuard)
  async getTicket(
    @Param('ticketId', UUIDV4Pipe)
    ticketId: string,
    @User() user: UserEntity,
  ) {
    const foundTicket = await this.ticketsService.getTicketById(ticketId, user.userId);

    return {
      data: foundTicket,
    };
  }

  @Put(':ticketId/pay')
  @UseGuards(AuthTokenGuard)
  async payForTicket(
    @Param('ticketId', UUIDV4Pipe)
    ticketId: string,
    @User() user: UserEntity,
    @Body() dto: TicketPaymentReqDto,
  ) {
    const updatedTicket = await this.ticketsService.payForTicket(ticketId, user.userId, dto);

    return {
      data: updatedTicket,
    };
  }

  @Put(':ticketId/cancel')
  @UseGuards(AuthTokenGuard)
  async cancelPayment(
    @Param('ticketId', UUIDV4Pipe)
    ticketId: string,
    @User() user: UserEntity,
  ) {
    const updatedTicket = await this.ticketsService.cancelPayment(ticketId, user.userId);

    return {
      data: updatedTicket,
    };
  }
}
