import { IsNumber, IsString } from 'class-validator';

export class QueryDto {
  @IsString()
  sortBy: string = 'createdAt';
  @IsString()
  sortDirection: string = 'desc';
  @IsNumber()
  pageNumber: number = 1;
  @IsNumber()
  pageSize: number = 10;
}
