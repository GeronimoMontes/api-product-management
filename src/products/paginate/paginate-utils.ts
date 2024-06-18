export const getQrySeach = (search) =>
  search !== '' ? { $text: { $search: `\"${search}\"` } } : {};

export const getQryOrder = (order): any => {
  return { name: 'ascending', description: 'ascending' };
};
