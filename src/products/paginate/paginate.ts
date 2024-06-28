import { FilterQuery } from 'mongoose';

export interface Metadata {
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
  itemsPerPageCount: number;
  currentPage: number;
  search: FilterQuery<any> | string;
  nextPage: number;
  previusPage: number;
}

export interface Paginate<T> {
  data: T[];
  metadata: Metadata;
}

export interface PaginateQueryRaw {
  page?: number;
  limit?: number;
  search?: string | FilterQuery<any>;
  sort?: any;
}
