export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  pagination: PaginationDto;
}
