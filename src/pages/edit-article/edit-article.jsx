/* eslint-disable react/jsx-props-no-spreading */
import { useSelector, useDispatch } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { selectIsAuth } from "../../store/authSlice";
import { Redirect, useHistory } from "react-router-dom";
import { fetchEditArticle } from "../../store/articlesSlice";
import { useState, useEffect } from "react";
import axios from "axios";

import './edit-article.css';

const EditArticle = () => {
  const [titleInput, setTitleInput] = useState("");
  const [shortInput, setShortInput] = useState("");
  const [bodyInput, setBodyInput] = useState("");
  const [tagsInput, setTagsInput] = useState([]);
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    control,

    formState: { errors, isValid },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      tags: [...tagsInput],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
    rules: {
      required: "Please append at least 1 item",
    },
  });

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const slug = localStorage.getItem("slug");
      const response = await axios.get(`https://blog.kata.academy/api/articles/${slug}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setTitleInput(response?.data.article?.title);
      setShortInput(response?.data.article?.description);
      setBodyInput(response?.data.article?.body);
      setTagsInput(response?.data.article?.title);
    }
    fetchData();
  }, []);

  const onSubmit = (data) => {
    const slug = localStorage.getItem("slug");

    const payload = {
      slug,
      userData: {
        article: {
          title: data.title,
          description: data.description,
          body: data.textarea,
          tagList: data.tags.map((el) => el.name),
        },
      },
    };

    dispatch(fetchEditArticle(payload));
    history.push(`/`);
  };
  // чтобы нельзя было перейти на страницу редактирования если не авторизован
  if (!isAuth && !localStorage.getItem("token")) {
    return <Redirect to="/sign-in" />;
  }

  return (
    <div className="form-container">
    <h3 className="form-title">Edit article</h3>
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="label-container">
        <label htmlFor="username">
          <span className="title-input" >Title</span>
          <input className="input-text"
            value={titleInput}
            type="text"
            name="title"
            {...register("title", {
              required: "The field is required",
            })}
            onChange={(e) => setTitleInput(e.target.value)}
          />
          {errors?.title && <div className="incorrect-data">{errors?.title?.message}</div>}
        </label>
      </div>
      <div className="label-container">
        <label htmlFor="username">
        <span className="title-input">Short description</span>
          <input className="input-description"
            value={shortInput}
            type="text"
            name="description"
            {...register("description", {
              required: "The field is required",
            })}
            onChange={(e) => setShortInput(e.target.value)}
          />
          {errors?.description && <div className="incorrect-data">{errors?.description?.message}</div>}
        </label>
      </div>
      <div className="label-container">
        <label htmlFor="textarea">
        <span className="title-input">Description</span>
          <input className="text-input"
            value={bodyInput}
            type="text"
            name="textarea"
            {...register("textarea", {
              required: "The field is required",
            })}
            onChange={(e) => setBodyInput(e.target.value)}
          />
          {errors?.textarea && <div className="incorrect-data">{errors?.textarea?.message}</div>}
        </label>
      </div>
      <div>
        <span className="title-tag">Title</span>
      </div>
      {fields.length > 0 ? (
        fields.map((field, index) => (
          <section key={field.id}>
            <label htmlFor={`tags.${index}.name`}>
              <input className="tag-input"
                type="text"
                name={`tags.${index}.name`}
                {...register(`tags.${index}.name`, {})}
              />
            </label>
            <button className="btn_delete-tag"
              type="button"
              onClick={() => {
                remove(index);
              }}
            >
              Delete Tag
            </button>
            {index === fields.length - 1 && (
              <buttun className="btn_add-tag"
                type="button"
                onClick={() => {
                  append({
                    name: "",
                  });
                }}
              >
                Add Tag
              </buttun>
            )}

            {index === fields.length - 1 && field.name === "" && (
              <div className="incorrect-data">Перед отправкой формы, убедитесь что поле не пустое.</div>
            )}
          </section>
        ))
      ) : (
        <button className="btn_add-tag"
          type="button"
          onClick={() => {
            append({
              name: "",
            });
          }}
        >
          Add Tag
        </button>
      )}
      <input className="submit-btn" type='submit' value="Create" disabled={!isValid} />
    </form>
  </div>
  )
};


export default EditArticle;