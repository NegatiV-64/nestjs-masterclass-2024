import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { CreateTicketReqDto } from './dto/requests/create-ticket.dto';
import { UserRole } from 'src/shared/constants/user-role.constant';
import { Roles, RolesGuard } from 'src/shared/guards/roles.guard';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

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
}
