import { useEffect, useState, FormEvent } from "react";
import Recipe from "./Recipe";
import { ResponseType } from "../types/types.module";

const App = () => {
  const APP_ID = import.meta.env.VITE_APP_ID;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const [search, setSearch] = useState(""); //what to search
  const [query, setQuery] = useState(""); //start search
  const [recipes, setRecipes] = useState([]); //store result

  const [loading, setLoading] = useState(false); //is fetching?
  const [empty, setEmpty] = useState(false); //did fetch give empty resp? Initial false since no fetch request was made

  const request = `https://api.edamam.com/api/recipes/v2?type=any&q=${query}&app_id=${APP_ID}&app_key=${API_KEY}`;

  useEffect(() => {
    console.log("effect");
    if (query.length !== 0) {
      console.log(`Searching for ${query}`);
      getResponse();
    }
  }, [query]);

  const getResponse = async () => {
    try {
      setLoading(true);
      const response = await fetch(request);
      const data = await response.json();
      setRecipes(data.hits);
      data.hits.length === 0 ? setEmpty(true) : setEmpty(false);
    } catch (err: any) {
      setLoading(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!search.trim()) return;
    e.preventDefault();
    setQuery(search);
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
        {loading && <p>Searching for {query}...</p>}
        {!loading && empty && <p>No search results for {query}.</p>}
      </div>
      <div className="recipes">
        {recipes.map((item: ResponseType) => {
          return (
            <Recipe
              key={item.recipe.uri}
              title={item.recipe.label}
              image={item.recipe.image}
            />
          );
        })}
      </div>
    </>
  );
};

export default App;
