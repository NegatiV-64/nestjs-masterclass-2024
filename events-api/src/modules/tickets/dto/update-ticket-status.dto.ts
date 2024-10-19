import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { TicketStatus } from 'src/shared/constants/ticket-status';

export class UpdateTicketStatusDto {
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @IsEnum(TicketStatus)
  @IsNotEmpty()
  status: TicketStatus;

  @IsUUID()
  @IsNotEmpty()
  transactionId: string;

  @IsUUID()
  @IsString()
  userId: string;
}
