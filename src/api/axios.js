import axios from "axios";

const instance = axios.create({
  baseURL: "https://blog.kata.academy/api/",
});

export default instance;