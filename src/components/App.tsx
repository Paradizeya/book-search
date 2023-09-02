import { useState, FormEvent } from "react";
import Item from "./Item";
//import { ResponseType } from "../types/types.module";
import useItemSearch from "./useItemSearch";
import { useInfiniteQuery } from "react-query";

const App = () => {
  const [search, setSearch] = useState(""); //sort of a debouns
  const [filter, setFilter] = useState(""); //query
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);

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
    await setPage(1);
    await refetch();
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
            setSearch(e.target.value);
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
            return p.data.docs.map((item: any) => {
              return <Item key={item.key} title={item.title} />;
            });
          })}
        </div>
      )}

      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={async () => {
            await setPage((prevPage) => prevPage + 1);
            await fetchNextPage();
          }}
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </>
  );
};

export default App;
