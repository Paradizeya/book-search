type Props = {
  title: string;
  image: string;
};

const Recipe = ({ title, image }: Props) => {
  return (
    <div className="recipe">
      <h1 className="recipe__title">{title}</h1>
      <img className="recipe__img" src={image} alt={title} />
    </div>
  );
};

export default Recipe;
