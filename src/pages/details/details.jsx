import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Info from "../../components/info/info";
import { Skeleton } from "antd";

function Details() {
  const [article, setArticle] = useState(null);
  const { push } = useHistory();
  const { slug } = useParams();

  useEffect(() => {
    axios.get(`https://blog.kata.academy/api/articles/${slug}`).then(({ data }) => setArticle(data.article));
  }, [slug]);

  return (
    <div>
      {article ? <Info push={push} {...article} /> : <Skeleton style={{ marginTop: "20px" }} />}
    </div>
  );
}

export default Details;