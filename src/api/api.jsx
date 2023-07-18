import axios from "axios";

export const fetchFullArticle = async (slug) => {
  try {
    const response = await axios.get(`https://blog.kata.academy/api/articles/${slug}`);
    return response.data.article;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userData, token) => {
  try {
    const response = await axios.put(
      `https://blog.kata.academy/api/user`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.errors);
  }
};

export const fetchUserData = async (token) => {
  try {
    const response = await axios.get(`https://blog.kata.academy/api/user`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data.user;
  } catch (error) {
    throw new Error(error.response.data.errors);
  }
};

export const allArticles = async () => {
  try {
    const res = await axios.get(`https://blog.kata.academy/api/articles?limit=5&offset=5`);
    return res.data.articlesCount;
  } catch (error) {
    throw new Error(error.response.data.errors);
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`https://blog.kata.academy/api/users`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data.errors;
  }
};

