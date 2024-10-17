import { IsNotEmpty, IsNumber, IsPositive, IsString, Length } from 'class-validator';
import { IsDateFormatValid } from '../../../shared/validators/date-format.validator';
import { TimeFormat } from '../../../shared/constants/time.constant';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Last 4 digits of card',
    example: 1234,
  })
  @IsNotEmpty()
  @IsPositive()
  @Length(4, 4, { message: 'Must contain exactly 4 digits' })
  last4Digits: number;

  @ApiProperty({
    description: 'Expiry date of the card in MM/YY format',
    example: '12/24',
  })
  @IsString()
  @IsNotEmpty()
  @IsDateFormatValid(TimeFormat.CalendarForCard)
  cardExpiry: string;

  @ApiProperty({
    description: 'Cardholder’s name as printed on the card',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  cardHolderName: string;

  @ApiProperty({
    description: 'Unique token assigned to this transaction for payment processing',
    example: 'tok_visa_1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  paymentToken: string;

  @ApiProperty({
    description: 'Total amount to be charged for this payment',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  paymentAmount: number;
}
