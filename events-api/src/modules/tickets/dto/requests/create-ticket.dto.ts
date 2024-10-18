import { IsInt, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
import { ParseFloat, ParseInt } from 'src/shared/transformers';

export class CreateTicketReqDto {
  @ParseInt()
  @IsInt()
  @IsPositive()
  ticketQuantity: number;

  @ParseFloat()
  @IsNumber()
  @IsPositive()
  ticketPrice: number;

  @IsString()
  @IsUUID()
  ticketEventId: string;
}
