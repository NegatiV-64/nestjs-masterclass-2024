import { Transform } from 'class-transformer';
import { IsInt, IsPositive, IsString, Length, Max, Min } from 'class-validator';
import { TimeFormat } from 'src/shared/constants/time.constant';
import { IsDateFormatValid } from 'src/shared/validators/date-format.validator';

export class PayTicketReqDto {
  @Transform(({ value }) => (typeof value !== 'string' ? undefined : parseInt(value, 10)), { toClassOnly: true })
  @IsInt()
  @Min(1000)
  @Max(9999)
  last4Digits: number;

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
