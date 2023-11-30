import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDto {
  @IsString()
  sortBy: string = 'createdAt';
  @IsString()
  sortDirection: string = 'desc';
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageNumber: number = 1;
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize: number = 10;
}
