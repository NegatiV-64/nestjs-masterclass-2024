import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { CreateTicketReqDto } from './dto/requests/create-ticket.dto';
import { PaymentDto } from './dto/requests';
import { CurrentUser } from 'src/shared/decorators/CurrentUser.decorator';

@Controller('tickets')
@UseGuards(AuthTokenGuard)
export class TicketsController {
    constructor (private readonly ticketsService: TicketsService) {}

    @Post()
    public async createTicket(@Body() dto: CreateTicketReqDto, @CurrentUser('userId') userId: string,) {
        const createdTicket = await this.ticketsService.createTicket(dto, userId);

        return {
            data: createdTicket,
        };
    }

    @Get()
    async allTickets(@CurrentUser('userId') userId: string,) {
        const tickets = await this.ticketsService.allTickets(userId)
        return {data: tickets}
    }

    @Get(':ticketId')
    async getTicketById(@CurrentUser('userId') userId: string, @Param("ticketId") id) {
        const ticket = await this.ticketsService.getTicketById(userId, id)
        return {data: ticket}
    }

    @Put(':ticketId/pay')
    async payForTicket(@Param("ticketId") ticketId: string, @CurrentUser('userId') userId: string, @Body() dto: PaymentDto) {
        const paidTicket = await this.ticketsService.payForTicket(ticketId, dto, userId)
        return {data: paidTicket}
    }
}
