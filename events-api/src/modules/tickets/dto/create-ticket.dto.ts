import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTicketDto {
    @ApiProperty({
        example: 5
    })
    @IsNumber()
    ticketQuantity: number;

    @ApiProperty({
        example: 20.99
    })
    @IsNumber()
    ticketPrice: number;

    @ApiProperty({
        example: "087c98cc-6e8e-45e5-9d56-ab6f36a4c240"
    })
    @IsString()
    @IsNotEmpty()
    ticketEventId: string;
}
