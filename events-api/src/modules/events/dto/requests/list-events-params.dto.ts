import { Transform } from "class-transformer";
import {
    IsIn,
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
    Max
} from "class-validator";

export class ListEventsParamsReqDto {
    @Transform(
        (params) => {
            const { value } = params;

            if (typeof value !== "string") {
                return undefined;
            }

            const parsedValue = parseInt(value, 10);

            return parsedValue;
        },
        {
            toClassOnly: true
        }
    )
    @IsOptional()
    @IsInt()
    @IsPositive()
    page?: number;

    @Transform(
        (params) => {
            const { value } = params;

            if (typeof value !== "string") {
                return undefined;
            }

            const parsedValue = parseInt(value, 10);

            return parsedValue;
        },
        {
            toClassOnly: true
        }
    )
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Max(1000)
    limit?: number;

    @IsOptional()
    @IsString()
    @IsIn(["eventName", "eventDate", "eventCreatedAt", "eventUpdatedAt"])
    sort_by?: string;

    @IsOptional()
    @IsString()
    @IsIn(["asc", "desc"])
    sort_order?: "asc" | "desc";

    @IsOptional()
    @IsString()
    name?: string;
}
