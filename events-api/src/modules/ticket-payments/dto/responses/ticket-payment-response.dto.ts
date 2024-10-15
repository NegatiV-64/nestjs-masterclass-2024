import { IsString, IsUUID } from 'class-validator';

export class TicketPaymentResponseDto {
  @IsString()
  message: string;

  @IsString()
  @IsUUID(4)
  transactionId: string;
}
