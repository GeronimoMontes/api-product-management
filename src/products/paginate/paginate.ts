import { FilterQuery } from "mongoose";

export interface Metadata {
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
  itemsPerPageCount: number;
  currentPage: number;
  searchTerm: FilterQuery<any>;
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
  searchTerm?: FilterQuery<any>; 
  sort?: any; 
}