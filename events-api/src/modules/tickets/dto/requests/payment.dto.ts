import { IsInt, IsNumber, IsPositive, IsString, MaxLength, MinLength, Validate } from "class-validator"
import { TimeFormat } from "src/shared/constants/time.constant"
import { IsDateFormatValid } from "src/shared/validators/date-format.validator"
import { IsFourDigits } from "../../validators/isFourDigits.validator"

export class PaymentDto {
    @IsInt()
    @IsPositive()
    @Validate(IsFourDigits)
    last4Digits: number

    @IsString()
    @IsDateFormatValid(TimeFormat.CardExpiry)
    cardExpiry: string

    @IsString()
    cardHolderName: string

    @IsString()
    @MinLength(22)
    @MaxLength(22)
    paymentToken: string

    @IsNumber()
    @IsPositive()
    paymentAmount: number
}