import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BlogQueryDto {
  @IsString()
  @IsOptional()
  searchNameTerm: string | null = '';
  @IsString()
  @IsOptional()
  sortBy: string = 'desc';
  @IsString()
  @IsOptional()
  sortDirection: string | null = 'createdAt';
  @IsNumber()
  @IsOptional()
  pageNumber: number = 1;
  @IsNumber()
  @IsOptional()
  pageSize: number = 10;
}

// export const paginationQueries = () => {
//     let pageNumber = query.pageNumber ? +req.query.pageNumber : 1
//     let pageSize = req.query.pageSize ? +req.query.pageSize : 10
//     let sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
//     let sortDirection = req.query.sortDirection && req.query.sortDirection.toString() === 'asc' ? 'asc' : 'desc'
//
//     return { pageNumber, pageSize, sortBy, sortDirection }
