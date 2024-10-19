import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateTicketReqDto {
  @IsNumber()
  @IsNotEmpty()
  ticketQuantity: number;

  @IsNumber()
  @IsNotEmpty()
  ticketPrice: number;

  @IsUUID()
  @IsNotEmpty()
  ticketEventId: string;
}
