import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { SORT_BY_OPTIONS, SORT_DIRECTIONS } from '../../events.constants';

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
  @IsIn(SORT_BY_OPTIONS)
  sort_by?: string;

  @IsOptional()
  @IsString()
  @IsIn(SORT_DIRECTIONS)
  sort_order?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
