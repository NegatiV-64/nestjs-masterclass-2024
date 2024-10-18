import { IsNumber, IsPositive, IsString, Length, Matches } from 'class-validator';
import { TimeFormat } from 'src/shared/constants/time.constant';
import { ParseFloat } from 'src/shared/transformers';
import { IsDateFormatValid } from 'src/shared/validators/date-format.validator';

export class TicketPaymentReqDto {
  @Matches(/^\d+$/, { message: 'last4Digits must contain only digits' })
  @Length(4, 4)
  last4Digits: string;

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
