import { useParams } from "react-router-dom";

// type Props = {
//   title: string;
//   authors: string[];
//   cover_i: number;
// };

const ItemPage = () => {
  const { workId } = useParams();
  return <div className="item-page">test {workId}</div>;
};

export default ItemPage;
