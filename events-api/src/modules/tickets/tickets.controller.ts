import { Body, Controller, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketReqDto } from './dto/requests/create-ticket.dto';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { AuthenticatedRequest } from 'src/shared/interfaces/authenticated-request.interface';
import { TicketPaymentReqDto } from './dto/requests/ticket-payment.dto';
import { TicketResponseDto } from './dto/responses/ticket-response.dto';
import { ListTicketsResponseDto } from './dto/responses/list-tickets-response.dto';

@Controller('tickets')
@ApiTags('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new ticket(s) for an event' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiCreatedResponse({ description: 'Ticket(s) created successfully', type: TicketResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid request body provided' })
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  async createTicket(@Request() req: AuthenticatedRequest, @Body() dto: CreateTicketReqDto) {
    const createdTicket = await this.ticketsService.createTicket(req.user.userId, dto);

    return {
      data: createdTicket,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets of user' })
  @ApiOkResponse({ description: 'Tickets retrieved successfully', type: ListTicketsResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  async getTickets(@Request() req: AuthenticatedRequest) {
    const tickets = await this.ticketsService.getTickets(req.user.userId);

    return {
      data: tickets,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single ticket of user' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiCreatedResponse({ description: 'Ticket retrieved successfully', type: TicketResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid ID provided' })
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  async getTicketById(
    @Request() req: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    id: string,
  ) {
    const foundTicket = await this.ticketsService.getTicketById(req.user.userId, id);

    return {
      data: foundTicket,
    };
  }

  @Put(':id/pay')
  @ApiOperation({ summary: 'Pay for a ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiCreatedResponse({ description: 'Payment successful', type: TicketResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid ID provided' })
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  async payForTicket(
    @Request() req: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    id: string,
    @Body() dto: TicketPaymentReqDto,
  ) {
    const paidForTicket = await this.ticketsService.payForTicket(req.user.userId, id, dto);

    return {
      data: paidForTicket,
    };
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel a ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID' })
  @ApiCreatedResponse({ description: 'Ticket cancelled', type: TicketResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid ID provided' })
  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard)
  async cancelTicket(
    @Request() req: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    id: string,
  ) {
    const cancelledTicket = await this.ticketsService.cancelTicket(req.user.userId, id);

    return {
      data: cancelledTicket,
    };
  }
}
