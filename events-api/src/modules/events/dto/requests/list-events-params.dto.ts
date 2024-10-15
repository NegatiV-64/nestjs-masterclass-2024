import { SortOrderEnum } from './../../types/query.type';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { EventSortEnum } from '../../types/query.type';

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
  @IsEnum(EventSortEnum, {
    message: 'sort_by must be one of: eventName, eventDate, eventCreatedAt, eventUpdatedAt',
  })
  sort_by?: EventSortEnum;

  @IsOptional()
  @IsEnum(SortOrderEnum, { message: 'order must be either asc or desc' })
  sort_order?: SortOrderEnum;
}