import { QueryDto } from '../pagination/pagination.query.dto';

export const pagesCount = (totalCount: number, pageSize: number) => {
  return Math.ceil(totalCount / pageSize);
};

export class PaginationView<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T;
  constructor(page: number, pageSize: number, totalCount: number, items: T) {
    this.pagesCount = pagesCount(totalCount, pageSize);
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.items = items;
  }
}

export const pagination = (queryDto: QueryDto) => {
  const sortBy = queryDto.sortBy ? queryDto.sortBy.toString() : 'createdAt';
  const pageSize = queryDto.pageSize ? +queryDto.pageSize : 10;
  const pageNumber = queryDto.pageNumber ? +queryDto.pageNumber : 1;
  const sortDirection =
    queryDto.sortDirection && queryDto.sortDirection.toString() === 'asc'
      ? 'asc'
      : 'desc';

  return { sortBy, pageSize, pageNumber, sortDirection };
};
