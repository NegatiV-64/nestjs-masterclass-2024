import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { UUID4PipeOptions } from 'src/shared/constants/uuid4-pipe-options.constant';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { TicketsService } from './tickets.service';
import { CreateTicketReqDto } from './dto/requests/create-ticket.dto';
import { ListTicketsParamsReqDto } from './dto/requests/list-tickets-params.dto';
import { PayTicketReqDto } from './dto/requests/pay-ticket.dto';
import { SnakeToCamelCasePipe } from 'src/shared/pipes/snake-to-camel-case.pipe';
import { AuthUserPayload } from 'src/shared/types/auth-user-payload.type';
import { User } from 'src/shared/decorators/user.decorator';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(AuthTokenGuard)
  async createTicket(@Body() dto: CreateTicketReqDto, @User('userId') userId: AuthUserPayload['userId']) {
    const createdTicket = await this.ticketsService.createTicket({ ...dto, ticketUserId: userId });

    return {
      data: createdTicket,
    };
  }

  @Get()
  @UseGuards(AuthTokenGuard)
  @UsePipes(new SnakeToCamelCasePipe())
  async listTickets(@Query() searchParams: ListTicketsParamsReqDto, @User('userId') userId: AuthUserPayload['userId']) {
    const tickets = await this.ticketsService.listTickets(searchParams, userId);

    return {
      data: tickets,
    };
  }

  @Get(':ticketId')
  @UseGuards(AuthTokenGuard)
  async getTicketById(
    @Param('ticketId', new ParseUUIDPipe(UUID4PipeOptions))
    ticketId: string,
    @User('userId') userId: AuthUserPayload['userId'],
  ) {
    const foundTicket = await this.ticketsService.getTicketById(ticketId, userId);

    return {
      data: foundTicket,
    };
  }

  @Put(':ticketId/pay')
  @UseGuards(AuthTokenGuard)
  async payTicket(
    @Param('ticketId', new ParseUUIDPipe(UUID4PipeOptions)) ticketId: string,
    @User('userId') userId: AuthUserPayload['userId'],
    @Body() dto: PayTicketReqDto,
  ) {
    const paidTicket = await this.ticketsService.payForTicket(dto, ticketId, userId);

    return {
      data: paidTicket,
    };
  }

  @Put(':ticketId/cancel')
  @UseGuards(AuthTokenGuard)
  async cancelTicket(@Param('ticketId', new ParseUUIDPipe(UUID4PipeOptions)) ticketId: string, @User('userId') userId: AuthUserPayload['userId']) {
    const canceledTicket = await this.ticketsService.cancelTicket(ticketId, userId);

    return {
      data: canceledTicket,
    };
  }
}
