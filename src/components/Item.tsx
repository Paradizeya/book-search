type Props = {
  title: string;
};

const Item = ({ title }: Props) => {
  return (
    <div className="item">
      <h1 className="item__title">{title}</h1>
    </div>
  );
};

export default Item;
