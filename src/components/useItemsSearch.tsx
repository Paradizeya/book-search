import axios from "axios";

const useItemsSearch = async (
  filter: string,
  page: number = 1,
  limit: number = 100
) => {
  const { data } = await axios.get(`https://openlibrary.org/search.json`, {
    params: { q: filter, page: page, limit: limit },
  });
  console.log(`Searching for ${filter}, page: ${page}`);
  console.log(data);
  //console.log(data.numFound >= limit * page ? page + 1 : undefined);
  return {
    nextPage: data.numFound >= limit * page ? page + 1 : undefined,
    data: data,
  };
};

export default useItemsSearch;
