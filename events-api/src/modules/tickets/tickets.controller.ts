import { BadRequestException, Body, Controller, Get, HttpStatus, Param, ParseUUIDPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { CreateTicketReqDto } from './dto/requests/create-ticket.dto';
import { UserRole } from 'src/shared/constants/user-role.constant';
import { Roles, RolesGuard } from 'src/shared/guards/roles.guard';
import { PaymentDetailsDto } from '../payment/dto/response/payment-details.dto';
import { PaymentService } from '../payment/payment.service';
import { ErrorPaymentResDto } from '../payment/dto/response/error-response.dto';
import { TicketStatus } from 'src/shared/constants/ticket-status';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post()
  @Roles(UserRole.User)
  @UseGuards(AuthTokenGuard, RolesGuard)
  public async createTicket(@Body() dto: CreateTicketReqDto, @Request() req) {
    const createdTicket = await this.ticketsService.createTicket(req.user.userId, dto);

    return {
      data: createdTicket,
    };
  }

  @Get()
  @Roles(UserRole.User)
  @UseGuards(AuthTokenGuard, RolesGuard)
  public async getMyTickets(@Request() req) {
    const myTickets = await this.ticketsService.getMyTickets(req.user.userId);

    return {
      data: myTickets,
    };
  }

  @Get(':ticketId')
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
    const foundEvent = await this.ticketsService.getTicketById(ticketId);

    if (!foundEvent) {
      throw new BadRequestException('Ticket not found');
    }
    return {
      data: foundEvent,
    };
  }

  @Put(':ticketId/pay')
  @Roles(UserRole.User)
  @UseGuards(AuthTokenGuard, RolesGuard)
  async payTicketById(
    @Body() paymentDetails: PaymentDetailsDto,
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
    const foundTicket = await this.ticketsService.getTicketById(ticketId);

    if (!foundTicket) {
      throw new BadRequestException('Ticket not found');
    }

    const paymentResult = await this.paymentService.pay(paymentDetails);

    if (paymentResult instanceof ErrorPaymentResDto) {
      throw new BadRequestException(paymentResult.error);
    }

    const updatedTicket = await this.ticketsService.updateTicketPaymentStatus({
      ticketId,
      userId,
      transactionId: paymentResult.transactionId,
      status: TicketStatus.Paid,
    });

    return {
      data: updatedTicket,
    };
  }
}
