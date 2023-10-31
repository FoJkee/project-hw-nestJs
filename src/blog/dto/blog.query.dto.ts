import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BlogQueryDto {
  @IsString()
  @IsOptional()
  searchNameTerm: string = '';
  @IsString()
  @IsOptional()
  sortBy: string = 'createAt';
  @IsString()
  @IsOptional()
  sortDirection: string = 'desc';
  @IsNumber()
  @IsOptional()
  pageNumber: number = 1;
  @IsNumber()
  @IsOptional()
  pageSize: number = 10;
}

export class QueryDto {
  @IsString()
  @IsOptional()
  sortBy: string = 'createdAt';
  @IsString()
  @IsOptional()
  sortDirection: string = 'desc';
  @IsNumber()
  @IsOptional()
  pageNumber: number = 1;
  @IsNumber()
  @IsOptional()
  pageSize: number = 10;
}
