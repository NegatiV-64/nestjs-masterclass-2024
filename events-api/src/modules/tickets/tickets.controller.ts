import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) { }

  @ApiOperation({ summary: 'Ceate new ticket for event' })
  @Post()
  @UseGuards(AuthTokenGuard, RolesGuard)
  async create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    const { userId } = req.user;
    const createdTicket = await this.ticketsService.createTicket(userId, createTicketDto);
    return {
      data: createdTicket
    }
  }

  @ApiOperation({ summary: "Fetch user's all tickets" })
  @Get()
  @UseGuards(AuthTokenGuard, RolesGuard)
  async getAllTickets(@Request() req) {
    const { userId } = req.user;
    const userTickets = await this.ticketsService.getAllTickets(userId);

    return {
      data: userTickets
    }
  }

  @ApiOperation({ summary: 'Get ticket by ID' })
  @Get(':ticketId')
  @UseGuards(AuthTokenGuard, RolesGuard)
  async getEventById(
    @Param(
      'ticketId',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    ticketId: string,
  ) {
    const ticket = await this.ticketsService.getTicketById(ticketId);

    return {
      data: ticket,
    };
  }
}
