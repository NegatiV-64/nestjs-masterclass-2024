import { IsString, MaxLength, MinLength } from "class-validator";
import { TimeFormat } from "src/shared/constants/time.constant";
import { IsDateFormatValid } from "src/shared/validators/date-format.validator";

export class CreateEventReqDto {
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    eventName: string;

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    eventDescription: string;

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    eventLocation: string;

    @IsString()
    @IsDateFormatValid(TimeFormat.CalendarWithTime)
    eventDate: string;
}
