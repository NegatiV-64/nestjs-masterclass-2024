import { IsNotEmpty, IsNumber, IsString, Length, Matches, Validate } from "class-validator";
import { CardExpiryConstraint } from '../../../shared/validators/cardValidators/card-expiry-date.validator';
import { CardHolderNameConstraint } from '../../../shared/validators/cardValidators/card-holder-name.validator';

export class PayTicketReqDto {
  @IsString()
  @Length(4, 4)
  @Matches(/^\d{4}$/, { message: 'Card digits must contain only 4 digits' })
  last4Digits: string;

  @IsString()
  @Validate(CardExpiryConstraint)
  cardExpiry: string;

  @IsString()
  @IsNotEmpty()
  @Validate(CardHolderNameConstraint)
  cardHolderName: string;

  @IsString()
  @Length(22, 22)
  paymentToken: string;

  @IsNumber()
  paymentAmount: number;
}