import { IsString, IsUUID } from 'class-validator';

export class TicketPaymentResponseDataDto {
  @IsString()
  message: string;

  @IsString()
  @IsUUID(4)
  transactionId: string;
}
