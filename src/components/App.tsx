import HomePage from "../pages/HomePage";
import ItemPage from "../pages/ItemPage";
import { Route, Routes } from "react-router-dom";
import { useRef } from "react";

const App = () => {
  let pagesCache = useRef(new Map());
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage pagesCache={pagesCache} />} />
        <Route path="/works/:workId" element={<ItemPage />} />
      </Routes>
    </>
  );
};

export default App;
