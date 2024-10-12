import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { ParseInt } from 'src/shared/transformers/parse-int.transformer';
import { SortBy } from 'src/shared/constants/sort-by.constant';
import { SortOrder } from 'src/shared/constants/sort-order.constant';

export class ListEventsParamsReqDto {
  @ParseInt()
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @ParseInt()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(1000)
  limit?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(SortBy)
  @IsString()
  sort_by?: SortBy;

  @IsOptional()
  @IsEnum(SortOrder)
  @IsString()
  sort_order?: SortOrder;
}
