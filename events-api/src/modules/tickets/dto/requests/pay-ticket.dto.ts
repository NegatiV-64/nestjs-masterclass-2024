import { IsInt, IsPositive, IsString, Length } from 'class-validator';
import { TimeFormat } from 'src/shared/constants/time.constant';
import { IsDateFormatValid } from 'src/shared/validators/date-format.validator';
import { IsDigitsValid } from 'src/shared/validators/digits.validator';

export class PayTicketReqDto {
  @IsString()
  @IsDigitsValid(4)
  last4Digits: string;

  @IsString()
  @IsDateFormatValid(TimeFormat.CreditCardExpiration)
  cardExpiry: string;

  @IsString()
  cardHolderName: string;

  @IsString()
  @Length(22, 22)
  paymentToken: string;

  @IsInt()
  @IsPositive()
  paymentAmount: number;
}
