import { CreateTicketReqDto } from '../dto/requests/create-ticket.dto';

export interface CreateTicketWithUser extends CreateTicketReqDto {
  ticketUserId: string;
}
