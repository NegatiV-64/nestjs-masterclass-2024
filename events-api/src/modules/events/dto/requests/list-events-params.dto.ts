import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Max } from 'class-validator';

export class ListEventsParamsReqDto {
  @Transform(
    (params) => {
      const { value } = params;

      if (typeof value !== 'string') {
        return undefined;
      }

      const parsedValue = parseInt(value, 10);

      return parsedValue;
    },
    {
      toClassOnly: true,
    },
  )
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @Transform(
    (params) => {
      const { value } = params;

      if (typeof value !== 'string') {
        return undefined;
      }

      const parsedValue = parseInt(value, 10);

      return parsedValue;
    },
    {
      toClassOnly: true,
    },
  )
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(1000)
  limit?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  sort_by?: string;

  @IsOptional()
  sort_order?: string;
}
