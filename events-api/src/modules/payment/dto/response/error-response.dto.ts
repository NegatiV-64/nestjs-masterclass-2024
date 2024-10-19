import { IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

export class ErrorPaymentResDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsUUID()
  @IsNotEmpty()
  transactionId: string;

  @IsObject()
  @IsNotEmpty()
  error: object;
}
