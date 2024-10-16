import { IsNumber, IsString, IsUUID, Min } from "class-validator";

export class CreateTicketReqDto {
  @IsNumber()
  @Min(0)
  ticketQuantity: number;

  @IsNumber()
  @Min(0)
  ticketPrice: number;

  @IsString()
  @IsUUID()
  ticketEventId:string;
}