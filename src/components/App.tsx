import HomePage from "../pages/HomePage";
import ItemPage from "../pages/ItemPage";
import { Route, Routes } from "react-router-dom";
import { useRef } from "react";

const App = () => {
  let pagesCache = useRef(new Map());
  let queryCache = useRef("");
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<HomePage pagesCache={pagesCache} queryCache={queryCache} />}
        />
        <Route path="/works/:workId" element={<ItemPage />} />
      </Routes>
    </>
  );
};

export default App;
