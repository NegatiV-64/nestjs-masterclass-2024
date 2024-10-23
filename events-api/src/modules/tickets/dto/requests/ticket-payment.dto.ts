import { Transform } from 'class-transformer';
import { IsNumber, IsPositive, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { TimeFormat } from 'src/shared/constants/time.constant';
import { IsDateFormatValid } from 'src/shared/validators/date-format.validator';

export class TicketPaymentReqDto {
  @IsString()
  @Length(4, 4)
  last4Digits: string;

  @IsString()
  @IsDateFormatValid(TimeFormat.CreditCardExpiry)
  cardExpiry: string;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 10,
  })
  @IsPositive()
  paymentAmount: number;

  @IsString()
  cardHolderName: string;

  @IsString()
  @MinLength(22)
  @MaxLength(22)
  paymentToken: string;
}
