import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { TicketsService } from './tickets.service';
import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CreateTicketReqDto } from './dto/create-ticket.dto';
import { UserId } from '../../shared/decorators/get-user-id.decorator';
import { ParsingUUIDPipe } from '../../shared/pipes/uuid-params.pipe';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService:TicketsService){}

  @Post()
  @UseGuards(AuthTokenGuard)
  public async createTicket(@Body() dto: CreateTicketReqDto, @UserId() userId:string){
    const createdTicket = await this.ticketsService.createTicket(userId, dto)

    return {
      data: createdTicket
    }
  }

  @Get()
  @UseGuards(AuthTokenGuard)
  async getTickets(){
    const tickets = await this.ticketsService.getTickets()

    return {
      data: tickets
    }
  }

  @Get(':ticketId')
  @UseGuards(AuthTokenGuard)
  async getTicketById(
    @Param('ticketId', ParsingUUIDPipe)
    ticketId:string
  ) {
    const foundTicket = await this.ticketsService.getTicketById(ticketId)

    return {
      data: foundTicket
    }
  }
}