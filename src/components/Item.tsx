import { Link } from "react-router-dom";

type Props = {
  id: string;
  title: string;
  authors: string[];
  cover_i: number;
};

const Item = ({ id, title, cover_i, authors }: Props) => {
  return (
    <div className="item">
      <div>
        <h1 className="item__title">{title}</h1>
        <h2 className="item__author">
          Author: {authors ? authors.join(", ") : "unknown"}
        </h2>
      </div>
      <img
        src={
          cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` : ``
        }
        alt="No cover available"
      />
      <Link to={`${id}`}>More...</Link>
    </div>
  );
};

export default Item;
