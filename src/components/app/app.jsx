import Header from "../header/header";
import Main from "../main/main";
import { Switch, Route, Redirect } from "react-router-dom"; // 5 версия
import CreateArticle from "../../pages/create-article/create-article";
import Details from "../../pages/details/details";
import EditProfileForm from "../../pages/edit-profile-form/edit-profile-form";
import Home from "../../pages/home/home";
import LoginForm from "../../pages/login-form/login-form";
import RegistrationForm from "../../pages/registration-form/registration-form";
import { useSelector } from "react-redux";
import { Alert } from "antd";
import { useState, useEffect } from "react";
import { fetchFullArticle } from "../../api/api";


function App(){

  const [article, setArticle] = useState(null);
  const isAuthor = () => {
    const data = JSON.parse(localStorage.getItem("data"));
    return data?.user?.username === article?.author?.username;
  };
  const slug = localStorage.getItem("slug");
  const status = useSelector((state) => state.articles.status);
  const error = status === "rejected" && (
    <Alert message="Произошла ошибка. Мы уже работаем над этим." type="error" showIcon />
  );

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
    <>
      <Header />
      <Main>
        {error}
      <Switch>
      <Route exact path="/" component={Home}>
          </Route>
          <Route path="/articles/:slug" component={Details} />
          <Route path="/:new-article" component={CreateArticle} />
          <Route path="/:sign-in" component={LoginForm} />
          <Route path="/:sign-up" component={RegistrationForm} />
          <Route path="/:profile" component={EditProfileForm} />
      </Switch>
    </Main>
  </>
  );
};

export default App;