import { IsNotEmpty, IsNumber, IsString, Length, Matches } from "class-validator";
import { TimeFormat } from "../../../shared/constants/time.constant";
import { IsDateFormatValid } from "../../../shared/validators/date-format.validator";
import { IsCardExpiryValid } from "../validators/card-expiry-date.validator";
import { IsCardHolderNameValid } from "../validators/card-holder-name.validator";

export class PayTicketReqDto {
  @IsString()
  @Length(4, 4)
  @Matches(/^\d{4}$/, { message: 'Card digits must contain only 4 digits' })
  last4Digits: string;

  @IsString()
  @IsDateFormatValid(TimeFormat.MonthWithYear)
  @IsCardExpiryValid()
  cardExpiry: string;

  @IsString()
  @IsNotEmpty()
  @IsCardHolderNameValid()
  cardHolderName: string;

  @IsString()
  @Length(22, 22)
  paymentToken: string;

  @IsNumber()
  paymentAmount: number;
}