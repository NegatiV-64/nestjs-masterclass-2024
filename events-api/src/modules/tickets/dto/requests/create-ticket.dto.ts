import { Transform } from "class-transformer";
import { IsInt, IsNumber, IsPositive, IsString, Max } from "class-validator";

export class CreateTicketReqDto {
    @Transform(
        (params) => {
            const { value } = params;

            if (typeof value !== "string") {
                return undefined;
            }

            return Number(value);
        },
        {
            toClassOnly: true
        }
    )
    @IsInt()
    @IsPositive()
    @Max(100000)
    ticketQuantity: number;

    @Transform(
        (params) => {
            const { value } = params;

            if (typeof value !== "string") {
                return undefined;
            }

            return Number(value);
        },
        {
            toClassOnly: true
        }
    )
    @IsNumber({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 10
    })
    @IsPositive()
    ticketPrice: number;

    @IsString()
    ticketEventId: string;
}
