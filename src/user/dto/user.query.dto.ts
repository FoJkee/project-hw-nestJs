import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserQueryDto {
  @IsString()
  @IsOptional()
  searchLoginTerm: string | null;
  @IsString()
  @IsOptional()
  searchEmailTerm: string | null;
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
