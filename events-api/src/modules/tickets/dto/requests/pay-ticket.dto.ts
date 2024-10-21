import { IsNotEmpty, IsString, IsNumberString, Length } from 'class-validator';
import { TimeFormat } from 'src/shared/constants/time.constant';
import { IsDateFormatValid } from 'src/shared/validators/date-format.validator';

export class PayTicketDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(4, 4, { message: 'Last 4 digits must be exactly 4 digits' })
  last4: string;

  @IsNotEmpty()
  @IsDateFormatValid(TimeFormat.CardTime, { message: `Invalid expiry date format. Use ${TimeFormat.CardTime}` })
  expiration: string;

  @IsNotEmpty()
  @IsString()
  cardholder: string;

  @IsNotEmpty()
  @IsString()
  @Length(22, 22, { message: 'Payment token must be exactly 22 characters' })
  paymentToken: string;

  @IsNotEmpty()
  @IsNumberString({}, { message: 'Payment amount must be a valid number' })
  amount: string;
}
