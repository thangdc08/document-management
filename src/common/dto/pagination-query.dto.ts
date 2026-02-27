import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../utils/constants';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = DEFAULT_LIMIT;
}