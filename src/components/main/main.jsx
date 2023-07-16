import { useSelector } from "react-redux";
import Spinner from "../spinner/spinner";

import './main.css'

const Main = ({ children }) => {
  const status = useSelector((state) => state.articles.status);
  const articles = useSelector((state) => state.articles.articles);
  const loading = articles.length === 0 && status === "loading" && <Spinner />;
  return (
    <div className="main">
      <div className="container">{children}</div>
      {loading}
    </div>
  );
}

export default Main;