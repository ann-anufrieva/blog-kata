import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Info from "../../components/info/info";
import { Skeleton } from "antd";
import { fetchFullArticle } from "../../api/api";

function Details() {
  const [article, setArticle] = useState(null);
  const { push } = useHistory();
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (slug) {
          const response = await fetchFullArticle(slug);
          setArticle(response);
        }
      } catch (error) {
        throw error;
      }
    };
  
    fetchData();
  }, [slug]);
  return (
    <div>
      {article ? <Info push={push} {...article} /> : <Skeleton style={{ marginTop: "20px" }} />}
    </div>
  );
}

export default Details;