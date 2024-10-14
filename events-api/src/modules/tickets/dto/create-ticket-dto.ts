import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTicketDto {
  @IsNumber()
  ticketQuantity: number;

  @IsNumber()
  ticketPrice: number;

  @IsString()
  @IsNotEmpty()
  ticketEventId: string;
}
