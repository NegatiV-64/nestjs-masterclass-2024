import { IsNotEmpty, IsString, IsNumberString, Length, Matches } from 'class-validator';

export class PayTicketDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(4, 4, { message: 'Last 4 digits must be exactly 4 digits' })
  last4Digits: string;

  @IsNotEmpty()
  @Matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: 'Invalid expiry date format. Use MM/YY' })
  cardExpiry: string;

  @IsNotEmpty()
  @IsString()
  cardHolderName: string;

  @IsNotEmpty()
  @IsString()
  @Length(22, 22, { message: 'Payment token must be exactly 22 characters' })
  paymentToken: string;

  @IsNotEmpty()
  @IsNumberString({}, { message: 'Payment amount must be a valid number' })
  paymentAmount: string;
}
