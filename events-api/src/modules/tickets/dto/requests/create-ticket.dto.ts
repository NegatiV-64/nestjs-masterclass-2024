import { IsInt, IsNotEmpty, IsPositive, IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  ticketQuantity: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  ticketPrice: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  ticketEventId: string;
}
