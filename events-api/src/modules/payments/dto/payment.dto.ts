import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator"
import { TimeFormat } from "src/shared/constants/time.constant"
import { IsDateFormatValid } from "src/shared/validators/date-format.validator"

export class PaymentDto {
    @ApiProperty({
        example: "4242"
    })
    @IsString()
    @Length(4, 4)
    last4Digits: string

    @ApiProperty({
        example: "30/30"
    })
    @IsString()
    @IsDateFormatValid(TimeFormat.CardDate)
    cardExpiry: string

    @ApiProperty({
        example: "Example Name"
    })
    @IsString()
    @IsNotEmpty()
    cardHolderName: string

    @ApiProperty({
        example: "abcdefghijklmnopqrstuv"
    })
    @IsString()
    @Length(22, 22)
    paymentToken: string

    @ApiProperty({
        example: 20.99
    })
    @IsNumber()
    paymentAmount: number
}