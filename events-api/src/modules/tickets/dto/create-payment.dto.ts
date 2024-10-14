import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsDateFormatValid } from '../../../shared/validators/date-format.validator';
import { TimeFormat } from '../../../shared/constants/time.constant';

export class CreatePaymentDto {
  @IsNotEmpty()
  last4Digits: number;

  @IsString()
  @IsNotEmpty()
  @IsDateFormatValid(TimeFormat.MMYY)
  cardExpiry: string;

  @IsString()
  @IsNotEmpty()
  cardHolderName: string;

  @IsString()
  @IsNotEmpty()
  paymentToken: string;

  @IsNumber()
  @IsNotEmpty()
  paymentAmount: number;
}
