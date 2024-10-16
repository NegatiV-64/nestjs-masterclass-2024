import { TicketStatus } from 'src/shared/constants/ticket-status.constant';

export class TicketDto {
  ticketId: string;
  ticketQuantity: number;
  ticketPrice: number;
  ticketStatus: TicketStatus;
  ticketCreatedAt: Date;
  ticketUpdatedAt: Date;
  ticketTransactionId: string;
  ticketEventId: string;
  ticketUserId: string;
}
