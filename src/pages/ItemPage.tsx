import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import "../styles/itemPage.scss";

const getItem = async (id: string) => {
  const { data } = await axios.get(`https://openlibrary.org/works/${id}.json`);
  console.log(data);
  return data;
};

const ItemPage = () => {
  const { workId } = useParams();
  const { data, isLoading, isError } = useQuery(
    workId ? workId : "",
    () => getItem(workId ? workId : ""),
    { refetchOnWindowFocus: false }
  );

  return (
    <div className="item-page">
      {isLoading && <p>Loading...</p>}
      {!isLoading && isError && <p>Something went wrong.</p>}
      {data && (
        <>
          <h1>{data.title}</h1>
          <img
            src={
              data.covers
                ? `https://covers.openlibrary.org/b/id/${
                    data.covers[Math.floor(Math.random() * data.covers.length)]
                  }-M.jpg`
                : ``
            }
            alt="No cover available"
          />
          {data.subjects && (
            <>
              <h2>Subjects</h2>
              <ul>
                {data.subjects.map((subject: string) => {
                  return <li key={subject}>{subject}</li>;
                })}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ItemPage;
