import { configureStore } from '@reduxjs/toolkit';
import articlesSlice from "./articlesSlice";
import authSlice from "./authSlice";

const store = configureStore({
  reducer: {
    articles: articlesSlice,
    auth: authSlice,
  }
});

export default store;