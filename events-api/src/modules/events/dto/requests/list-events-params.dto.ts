import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { ParseInt } from 'src/shared/transformers/parse-int.transformer';
import { SortBy } from 'src/shared/constants/sort-by.constant';
import { SortOrder } from 'src/shared/constants/sort-order.constant';
import { ApiProperty } from '@nestjs/swagger';

export class ListEventsParamsReqDto {
  @ApiProperty({
    description: 'Page number for pagination',
    default: 1,
  })
  @ParseInt()
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @ApiProperty({
    description: 'The number of events per page',
    default: 20,
  })
  @ParseInt()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(1000)
  limit?: number;

  @ApiProperty({
    description: 'Filter events by name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Field to sory by',
    default: SortBy.EventCreatedAt,
  })
  @IsOptional()
  @IsEnum(SortBy)
  @IsString()
  sort_by?: SortBy;

  @ApiProperty({
    description: 'Sort order',
    default: SortOrder.Desc,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  @IsString()
  sort_order?: SortOrder;
}
