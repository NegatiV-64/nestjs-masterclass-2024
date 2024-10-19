import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { EventsSortBy, EventsSortOrder } from 'src/modules/events/constants/events-sort-params.constant';

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
    { toClassOnly: true },
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
    { toClassOnly: true },
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
  @IsEnum(EventsSortBy)
  @Expose({ name: 'sort_by' })
  sortBy?: EventsSortBy;

  @IsOptional()
  @IsEnum(EventsSortOrder)
  @Expose({ name: 'sort_order' })
  sortOrder?: EventsSortOrder;
}
