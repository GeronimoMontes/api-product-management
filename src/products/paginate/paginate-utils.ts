export const getQrySeach = (search) => {
  return search !== '' ? { $text: { $search: `\"${search}\"` } } : {};
};
export const getQryOrder = (order): any => {
  return { name: 'ascending', description: 'ascending' };
};
