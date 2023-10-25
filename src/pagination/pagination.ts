const pagesCount = (totalCount: number, pageSize: number) => {
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
