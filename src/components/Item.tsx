type Props = {
  title: string;
  cover_i: number;
};

const Item = ({ title, cover_i }: Props) => {
  return (
    <div className="item">
      <h1 className="item__title">{title}</h1>
      <img
        src={
          cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` : ``
        }
        alt="No cover available"
      />
    </div>
  );
};

export default Item;
