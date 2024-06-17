import { Model } from 'mongoose';
import { Metadata, Paginate, PaginateQueryRaw } from './paginate';

export const getAllPaginated = async <T>(
  model: Model<T>,
  query: PaginateQueryRaw,
): Promise<Paginate<T>> => {
  const skip = query.limit * query.page - query.limit;
  const count = await model.estimatedDocumentCount();
  const data = await model
    .find(query.searchTerm)
    .sort(query.sort)
    .limit(query.limit)
    .skip(skip)
    .exec();

  const itemsPerPage = Number(query.limit);
  const itemsPerPageCount = data.length;
  const totalPages = Math.ceil(count / itemsPerPage);
  const totalItems = count;
  const currentPage = Number(query.page);
  const nextPage = currentPage + 1;
  const previusPage = currentPage - 1;

  const metadata: Metadata = {
    itemsPerPage,
    itemsPerPageCount,
    totalPages,
    totalItems,
    currentPage,
    nextPage,
    previusPage,
    searchTerm: query.searchTerm,
  };

  return { data, metadata };
};
