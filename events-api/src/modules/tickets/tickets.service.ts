import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTicketReqDto } from "./dto/requests";
import { DatabaseService } from "../database/database.service";
import { EventsService } from "../events/events.service";

@Injectable()
export class TicketsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly eventsService: EventsService
    ) {}

    async createTicket(dto: CreateTicketReqDto, ticketUserId: string) {
        const existingEvent = await this.eventsService.getEventById(
            dto.ticketEventId
        );

        const createdTicket = await this.databaseService.ticket.create({
            data: {
                ticketQuantity: dto.ticketQuantity,
                ticketPrice: dto.ticketPrice,
                ticketStatus: "pending",
                ticketEvent: {
                    connect: { eventId: existingEvent.eventId }
                },
                ticketUser: {
                    connect: { userId: ticketUserId }
                }
            }
        });

        return createdTicket;
    }

    async getTickets(userId: string) {
        const userTickets = await this.databaseService.ticket.findMany({
            where: {
                ticketUserId: userId
            }
        });

        return userTickets;
    }

    async getTicketById(ticketId: string, userId: string) {
        const foundTicket = await this.databaseService.ticket.findUnique({
            where: {
                ticketId: ticketId,
                ticketUserId: userId
            }
        });

        if (!foundTicket) {
            throw new NotFoundException(`Ticket with id ${ticketId} not found`);
        }

        return foundTicket;
    }
}
