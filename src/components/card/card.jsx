import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import trimText from "../../utils/truncate";
import { fetchLikeArticle, fetchLikeDelete } from "../../store/articlesSlice";
import { selectIsAuth } from "../../store/authSlice";
import { useHistory } from "react-router-dom";

import './card.css';

const Card = ({
  username,
  img,
  title,
  date,
  description,
  tags,
  likesNumber,
  favorited,
  onClick,
  slug,
}) => {

  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const history = useHistory();
  const handleLikeClick = () => {
    // проверяем, что пользователь авторизован
    if (isAuth) {
      if (!favorited) {
        dispatch(fetchLikeArticle(slug));
        localStorage.setItem(`like_${slug}`, true);
      }
      if (favorited) {
        dispatch(fetchLikeDelete(slug));
        localStorage.removeItem(`like_${slug}`);
      }
    } else {
      history.push("/");
    }
  };

  return(
    <article className="card">
      <div className="card-wrapper">
        <div className="card-left">
          <div className="title-container">
          <span className="card-title" onClick={onClick}>{title.length > 30 ? trimText(title) : title}</span>
          <span className="like-container" onClick={handleLikeClick}>
          {localStorage.getItem(`like_${slug}`) ? (
            <IoHeartSharp color="red" />
          ) : (
            <IoHeartOutline />
          )}
          <span className="like-count">{likesNumber}</span>
        </span>
      </div>
      <div className="card-tags">
        {tags?.map((el, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span className="tag" key={i + el}>{el}</span>
        ))}
      </div>
      <span className="card-description">{description}</span>
    </div>
      
      <div className="card-right">
      <div className="card-container-right">
        <span className="card-author">{username}</span>
        <span className="card-date">{date ? format(new Date(date), "MMM dd, yyyy") : null}</span>
      </div>
      <img className="card-image" src={img || null} alt={username} />
    </div>
    </div>
  </article>
  );
};

export default Card;
