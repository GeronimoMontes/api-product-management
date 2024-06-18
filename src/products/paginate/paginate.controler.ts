import { Model } from 'mongoose';
import { Metadata, Paginate, PaginateQueryRaw } from './paginate';
import { getQryOrder, getQrySeach } from './paginate-utils';

export const getAllPaginated = async <T>(
  model: Model<T>,
  query: PaginateQueryRaw,
): Promise<Paginate<T>> => {
  const skip = query.limit * query.page - query.limit;
  const count = await model.countDocuments();
  const search = getQrySeach(query.search);
  const sort = getQryOrder(query.sort);

  const data = await model
    .find(search)
    .sort(sort)
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
    search: query.search,
  };

  return { data, metadata };
};
