import { IsInt, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateTicketReqDto {
  @IsInt()
  @IsPositive()
  ticketQuantity: number;

  @IsNumber()
  @IsPositive()
  ticketPrice: number;

  @IsString()
  @IsUUID(4)
  ticketEventId: string;
}
