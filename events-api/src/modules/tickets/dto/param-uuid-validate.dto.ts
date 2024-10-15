import { IsUUID } from 'class-validator';

export class TicketIdDto {
  @IsUUID('4', { message: 'The ticket ID must be a valid UUID' })
  ticketId: string;
}
