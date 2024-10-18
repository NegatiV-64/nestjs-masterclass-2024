import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { AuthTokenGuard } from 'src/shared/guards/auth-token.guard';
import { CreateTicketReqDto } from './dto/requests/create-ticket.dto';
import { PaymentDto } from './dto/requests';

@Controller('tickets')
export class TicketsController {
    constructor (private readonly ticketsService: TicketsService) {}

    @Post()
    @UseGuards(AuthTokenGuard)
    public async createTicket(@Body() dto: CreateTicketReqDto, @Request() req) {
        const createdTicket = await this.ticketsService.createTicket(dto, req.user.userId);

        return {
            data: createdTicket,
        };
    }

    @Get()
    @UseGuards(AuthTokenGuard)
    async allTickets(@Request() req) {
        const tickets = await this.ticketsService.allTickets(req.user.userId)
        return {data: tickets}
    }

    @Get(':ticketId')
    @UseGuards(AuthTokenGuard)
    async getTicketById(@Request() req, @Param("ticketId") id) {
        const ticket = await this.ticketsService.getTicketById(req.user.userId, id)
        return {data: ticket}
    }

    @Put(':ticketId/pay')
    @UseGuards(AuthTokenGuard)
    async payForTicket(@Param("ticketId") ticketId: string, @Request() req, @Body() dto: PaymentDto) {
        const paidTicket = await this.ticketsService.payForTicket(ticketId, dto, req.user.userId)
        return {data: paidTicket}
    }
}
