import { useState, FormEvent, useRef, useEffect } from "react";
import Item from "./Item";
import { Book } from "../types/types.module";
import useItemSearch from "./useItemSearch";
import { useInfiniteQuery } from "react-query";

const App = () => {
  const [search, setSearch] = useState(""); //sort of a debouns
  const [filter, setFilter] = useState(""); //query
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(21);
  let pagesCache = useRef(new Map());

  useEffect(() => {
    window.innerWidth <= 1204 ? setLimit(20) : setLimit(21);
  }, []);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(filter, () => useItemSearch(filter, page, limit), {
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
                  title={item.title}
                  cover_i={item.cover_i}
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
              await setPage((prevPage) => prevPage + 1);
              await fetchNextPage();
              await pagesCache.current.set(filter, page + 1);
            }}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        )}
      </div>
    </>
  );
};

export default App;
