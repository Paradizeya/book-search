import { useState, FormEvent } from "react";
import axios from "axios";
import Recipe from "./Recipe";
import { ResponseType } from "../types/types.module";
import { useMutation, useQuery } from "react-query";
import { isQueryKey } from "react-query/types/core/utils";

const APP_ID = import.meta.env.VITE_APP_ID;
const API_KEY = import.meta.env.VITE_API_KEY;

const getResponse = async (filter: string) => {
  const request = `https://api.edamam.com/api/recipes/v2?type=any&q=${filter}&app_id=${APP_ID}&app_key=${API_KEY}`;
  const { data } = await axios.get(request);
  console.log(`Searching for ${filter}`);
  console.log(data);
  return data;
};

const App = () => {
  const [search, setSearch] = useState(""); //what to search
  const [filter, setFilter] = useState("chicken"); //start search

  const { data, isLoading, isError } = useQuery(
    filter,
    () => getResponse(filter),
    {
      refetchOnWindowFocus: false,
    }
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!search.trim()) return;
    e.preventDefault();
    setFilter(search);
    console.log(filter);
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
          placeholder="Type something like soup or banana!"
        />
        <button className="search-form__button" type="submit">
          Search
        </button>
      </form>
      <div className="msg-block">
        {isLoading && <p>Searching for {filter}...</p>}
        {!isLoading && isError && <p>No search results for {filter}.</p>}
      </div>
      {data && (
        <div className="recipes">
          {data.hits.map((item: ResponseType) => {
            return (
              <Recipe
                key={item.recipe.uri}
                title={item.recipe.label}
                image={item.recipe.image}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default App;
