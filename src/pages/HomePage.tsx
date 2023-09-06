import { useState, FormEvent, useEffect } from "react";
import Item from "../components/Item";
import ToTheTop from "../components/ToTheTop";
import { Book } from "../types/types.module";
import useItemsSearch from "../components/useItemsSearch";
import { useInfiniteQuery } from "react-query";

type Props = {
  pagesCache: React.MutableRefObject<Map<any, any>>;
  queryCache: React.MutableRefObject<string>;
};

const testLimit = 1;

const HomePage = ({ pagesCache, queryCache }: Props) => {
  const [search, setSearch] = useState(""); //sort of a debouns
  const [filter, setFilter] = useState(queryCache.current); //query
  const [page, setPage] = useState(
    pagesCache.current.get(filter) ? pagesCache.current.get(filter) : 1
  );
  const [limit, setLimit] = useState(testLimit);

  useEffect(() => {
    window.innerWidth <= 1204 ? setLimit(testLimit) : setLimit(testLimit + 1);
  }, []);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(filter, () => useItemsSearch(filter, page, limit), {
    enabled: false,
    getNextPageParam: (prevData) => prevData.nextPage,
    refetchOnWindowFocus: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (!search.trim()) return;
    e.preventDefault();
    await setFilter(search);
    if (await pagesCache.current.has(search)) {
      await setPage(pagesCache.current.get(search));
    } else {
      await setPage(1);
    }
    await refetch({ refetchPage: (index) => index === page });
    queryCache.current = search;
    setSearch("");
  };

  return (
    <>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="search-form__input"
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value.toLowerCase());
          }}
          placeholder="What are you looking for today?"
        />
        <button
          disabled={isLoading}
          className="search-form__button"
          type="submit"
        >
          Search
        </button>
      </form>
      <div className="msg-block">
        {isLoading && <p>Searching for {filter}...</p>}
        {!isLoading && isError && <p>Something went wrong.</p>}
        {typeof data !== "undefined" ? (
          data.pages[0].data.numFound === 0 ? (
            <p>No results for {filter}.</p>
          ) : (
            <p>
              Found {data.pages[0].data.numFound} results for <i>{filter}</i>.
            </p>
          )
        ) : null}
      </div>

      {typeof data !== "undefined" && (
        <div className="items">
          {data.pages.map((p) => {
            return p.data.docs.map((item: Book) => {
              return (
                <Item
                  key={item.key}
                  id={item.key}
                  title={item.title}
                  cover_i={item.cover_i}
                  authors={item.author_name}
                />
              );
            });
          })}
        </div>
      )}
      <div className="load-more">
        {hasNextPage && (
          <button
            className="load-more__button"
            disabled={isFetchingNextPage}
            onClick={async () => {
              await setPage((prevPage: any) => prevPage + 1);
              await fetchNextPage();
              await pagesCache.current.set(filter, page + 1);
            }}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        )}
      </div>

      <ToTheTop />
    </>
  );
};

export default HomePage;
