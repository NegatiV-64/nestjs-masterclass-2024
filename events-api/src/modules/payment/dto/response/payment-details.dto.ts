import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class PaymentDetailsDto {
  @IsString()
  @IsNotEmpty()
  last4: number;

  @IsString()
  @IsNotEmpty()
  expiration: string;

  @IsString()
  @IsNotEmpty()
  cardholder: string;

  @IsString()
  @IsNotEmpty()
  @Length(22)
  paymentToken: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
