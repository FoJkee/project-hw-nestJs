import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class BlogQueryDto {
  @IsString()
  @IsOptional()
  searchNameTerm: string;
  @IsString()
  @IsOptional()
  sortBy: string = 'createAt';
  @IsString()
  @IsOptional()
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
