import { IsInt, IsNumber, IsPositive, IsString, Length } from 'class-validator';
import { TimeFormat } from 'src/shared/constants/time.constant';
import { ParseFloat, ParseInt } from 'src/shared/transformers';
import { IsDateFormatValid } from 'src/shared/validators/date-format.validator';

export class TicketPaymentReqDto {
  @ParseInt()
  @IsInt()
  @IsPositive()
  last4Digits: number;

  @IsString()
  @IsDateFormatValid(TimeFormat.MonthYear)
  cardExpiry: string;

  @IsString()
  cardHolderName: string;

  @IsString()
  @Length(22, 22)
  paymentToken: string;

  @ParseFloat()
  @IsNumber()
  @IsPositive()
  paymentAmount: number;
}
