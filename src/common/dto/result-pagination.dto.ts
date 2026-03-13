export class ResultPaginationDTO<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.meta = {
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
