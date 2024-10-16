import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  ticketQuantity: number;

  @IsNotEmpty()
  @IsPositive()
  ticketPrice: number;

  @IsNotEmpty()
  @IsString()
  ticketEventId: string;
}
