import { IsInt, IsNumber, IsPositive, IsString, Max } from 'class-validator';

export class CreateTicketReqDto {
  @IsInt()
  @IsPositive()
  @Max(100000)
  ticketQuantity: number;

  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 10,
  })
  @IsPositive()
  ticketPrice: number;

  @IsString()
  ticketEventId: string;
}
