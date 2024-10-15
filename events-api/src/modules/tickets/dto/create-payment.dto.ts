import { IsNotEmpty, IsNumber, IsPositive, IsString, Length } from 'class-validator';
import { IsDateFormatValid } from '../../../shared/validators/date-format.validator';
import { TimeFormat } from '../../../shared/constants/time.constant';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The last 4 digits of the card number',
    example: 1234,
  })
  @IsNotEmpty()
  @IsPositive()
  @Length(4, 4, { message: 'The last 4 digits must be exactly 4 characters long' })
  last4Digits: number;

  @ApiProperty({
    description: 'Card expiry date in MM/YY format',
    example: '12/24',
  })
  @IsString()
  @IsNotEmpty()
  @IsDateFormatValid(TimeFormat.CalendarForCard)
  cardExpiry: string;

  @ApiProperty({
    description: 'Name of the cardholder as it appears on the card',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  cardHolderName: string;

  @ApiProperty({
    description: 'Unique payment token generated for this transaction',
    example: 'tok_visa_1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  paymentToken: string;

  @ApiProperty({
    description: 'The amount to be charged for the payment',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  paymentAmount: number;
}
