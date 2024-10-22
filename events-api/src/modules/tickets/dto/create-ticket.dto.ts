import { IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateTicketReqDto {
  @IsNumber()
  @IsPositive()
  ticketQuantity: number;

  @IsNumber()
  @IsPositive()
  ticketPrice: number;

  @IsString()
  @IsUUID()
  ticketEventId:string;
}