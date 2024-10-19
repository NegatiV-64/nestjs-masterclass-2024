import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SuccessPaymentResDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsUUID()
  @IsNotEmpty()
  transactionId: string;
}
