import trimText from "../../utils/truncate";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeleteArticle, fetchLikeArticle, fetchLikeDelete } from "../../store/articlesSlice";
import { message, Popconfirm } from "antd";
import { useHistory, Link } from "react-router-dom";
import { selectIsAuth } from "../../store/authSlice";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

import './info.css';

const Info = (props) => {
  const { author, body, createdAt, description, tagList, title, slug, onClick } = props;

  const wrapperRef = useRef(null);
  const [height, setHeight] = useState(0);

  // Обновление высоты карточки после рендера и при изменении размеров окна
  useEffect(() => {
    function handleResize() {
      if (wrapperRef.current) {
        setHeight(wrapperRef.current.offsetHeight);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const data = JSON.parse(localStorage.getItem("data"));

  const isAuthor = () => {
    const authorName = data?.user?.username;
    return author?.username === authorName;
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const confirm = () => {
    dispatch(fetchDeleteArticle(slug));
    history.push("/");
  };
  const cancel = () => {
    message.error("Click on No");
  };

  const isAuth = useSelector(selectIsAuth);

  const [article, setArticle] = useState(null);
  const [likeCount, setLikeCount] = useState(article?.favoritesCount);
  const [isLiked, setIsLiked] = useState(localStorage.getItem(`like_${slug}`) === "true");

  const handleLikeClick = () => {
    // проверяем, что пользователь авторизован
    if (isAuth) {
      if (!isLiked) {
        setLikeCount(likeCount + 1);
        setIsLiked(true);
        localStorage.setItem(`like_${slug}`, true);
        dispatch(fetchLikeArticle(slug)).then(() => {
          // обновляем состояние только в случае успешного ответа
          setArticle((prevState) => ({
            ...prevState,
            favoritesCount: prevState.favoritesCount + 1,
          }));
        });
      } else {
        setLikeCount(likeCount - 1);
        setIsLiked(false);
        localStorage.removeItem(`like_${slug}`);
        dispatch(fetchLikeDelete(slug)).then(() => {
          // обновляем состояние только в случае успешного ответа
          setArticle((prevState) => ({
            ...prevState,
            favoritesCount: prevState.favoritesCount - 1,
          }));
        });
      }
    } else {
      history.push("/");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    axios.get(`https://blog.kata.academy/api/articles/${slug}`).then(({ data }) => setArticle(data.article));
  }, []);

  useEffect(() => {
    localStorage.setItem("slug", slug);
  }, [slug]);


  return (
    <article className="card" ref={wrapperRef} height={height}>
      <div className="card-wrapper">
        <div className="card-left">
          <div className="title-container">
            <span className="card-title" onClick={onClick}>{title.length > 30 ? trimText(title) : title}</span>
            <span className="like-container" onClick={handleLikeClick}>
              {isLiked ? <IoHeartSharp color="red" /> : <IoHeartOutline />} 
              <span className="like-count">{article?.favoritesCount}</span>
            </span>
          </div>
          <div className="card-tags">
            {tagList?.map((el, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <span className="tag" key={i + el}>{el}</span>
            ))}
          </div>
          <span className="card-description">{description}</span>
        </div>
        <div className="card-right">
          <div className="card-container-right">
            <span className="card-author">{author.username}</span>
            <span className="card-date">{createdAt ? format(new Date(createdAt), "MMM dd, yyyy") : null}</span>
          </div>
          <img className="card-image" src={author.image ? author.image : null} alt={author.image} />
        </div>
      </div>
      <div className="card-body">
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
      {isAuthor() ? (
        <div className="btn-container_info">
          <Popconfirm
            title="Delete Article"
            description="Are you sure to delete this article?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
            placement="right"
          >
            <button className="btn-delete_info">Delete</button>
          </Popconfirm>
          <Link to={`/articles/${slug}/edit`} className='btn-edit_info'>Edit</Link>
        </div>
      ) : null}
    </article>
  );
}

export default Info;