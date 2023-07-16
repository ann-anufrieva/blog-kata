import React, {useEffect, useState, useCallback} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom"; // 5 версия
import axios from "../../api/axios";
import { fetchArticles, changePage } from "../../store/articlesSlice";
import List from "../../components/list/list";
import Card from "../../components/card/card";

import { Pagination } from "antd";

import './home.css';

const Home = () => {

  const articles = useSelector((state) => state.articles.articles);
  const pageArticles = useSelector((state) => state.articles.page);
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [results, setResults] = useState(1);

  //теги???
  const fetchArticleData = useCallback(async () => {
    const res = await axios.get(`https://blog.kata.academy/api/articles?limit=5&offset=5`);
    setResults(res.data.articlesCount);
    dispatch(fetchArticles((pageArticles - 1) * 5));
  }, [dispatch, pageArticles]);

  //пагинация
  useEffect(() => {
    fetchArticleData();
  }, [fetchArticleData]);
  const articlesPagination = (
    <Pagination
      current={pageArticles}
      total={results}
      // чтобы при нажатии на realworld, пагинация не сбивалась
      onChange={(page) => dispatch(changePage(page))}
      pageSize={5}
      showSizeChanger={false}
    />
  );


  return (
    <List>
      {articles?.map((el, i) => (
        <Card
          // eslint-disable-next-line react/no-array-index-key, no-unsafe-optional-chaining
          key={el?.createdAt + i}
          username={el?.author?.username}
          img={el?.author?.image}
          title={el?.title}
          date={el?.createdAt}
          description={el?.description}
          tags={el?.tagList}
          likesNumber={el?.favoritesCount}
          favorited={el?.favorited}
          slug={el?.slug}
          onClick={() => push(`/articles/${el.slug}`)}
        />
      ))}
      {articles.length > 0 && articlesPagination}
    </List>
  )
};


export default Home;