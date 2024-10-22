import { PayTicketReqDto } from './dto/payment-ticket.dto';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { TicketsService } from './tickets.service';
import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { CreateTicketReqDto } from './dto/create-ticket.dto';
import { UserId } from '../../shared/decorators/get-user-id.decorator';
import { UUIDValidationPipe } from '../../shared/pipes/uuid-params.pipe';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService:TicketsService){}

  @Post()
  @UseGuards(AuthTokenGuard)
  public async createTicket(@Body() dto: CreateTicketReqDto, @UserId() userId:string){
    const createdTicket = await this.ticketsService.createTicket(userId, dto)

    return {
      message: "Ticket successfully created",
      data: createdTicket
    }
  }

  @Get()
  @UseGuards(AuthTokenGuard)
  async getUserTickets(@UserId() userId:string){
    const tickets = await this.ticketsService.getUserTickets(userId)

    return {
      message: "Tickets successfully received",
      data: tickets
    }
  }

  @Get(':ticketId')
  @UseGuards(AuthTokenGuard)
  async getUserTicketById(
    @UserId()
    userId:string,

    @Param('ticketId', UUIDValidationPipe)
    ticketId:string
  ) {
    const foundTicket = await this.ticketsService.getUserTicketById(userId, ticketId)

    return {
      message: "Ticket successfully received",
      data: foundTicket
    }
  }

  @Put(':ticketId/pay')
  @UseGuards(AuthTokenGuard)
  async payTicket(
    @Body() dto: PayTicketReqDto,
    @UserId() userId:string,
    @Param('ticketId', UUIDValidationPipe)
    ticketId: string,
  ){
    const payingTicketResult = await this.ticketsService.payTicket(userId, ticketId, dto)

    return payingTicketResult
  }

  @Put(':ticketId/cancel')
  @UseGuards(AuthTokenGuard)
  async cancelTicket(
    @UserId() userId:string,
    @Param('ticketId', UUIDValidationPipe)
    ticketId: string,
  ){
    const cancelledTicket = await this.ticketsService.cancelTicket(userId, ticketId)

    return {
      message: "Ticket successfully cancelled",
      data: cancelledTicket
    }
  }
}