import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (userData) => {
  const response = await axios.post(`https://blog.kata.academy/api/users/login`, userData);
  localStorage.setItem("token", response.data.user.token);
  localStorage.setItem("data", JSON.stringify(response.data));
  return response.data;
});

export const fetchRegister = createAsyncThunk("auth/fetchRegister", async (userData) => {
  try {
    const response = await axios.post(`https://blog.kata.academy/api/users`, userData);
    localStorage.setItem("token", response.data.user.token);
    localStorage.setItem("data", JSON.stringify(response.data));
    return response.data;
  } catch (e) {
    throw new Error("request error");
  }
});

export const fetchEditData = createAsyncThunk("auth/fetchRegister", async (userData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`https://blog.kata.academy/api/user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  localStorage.setItem("data", JSON.stringify(data));
  localStorage.setItem("image", JSON.stringify(data.user.image));
  return data;
});


export const initAuth = createAsyncThunk("auth/initAuth", async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const response = await axios.get(`https://blog.kata.academy/api/user`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    localStorage.setItem("data", JSON.stringify(response.data));
    return response.data;
  }
  return null;
});

const initialState = {
  data: null,
  status: "loading",
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.data = null;
    },
    login: (state, action) => {
      state.data = action.payload;
      localStorage.setItem("data", JSON.stringify(action.payload));
      localStorage.setItem("token", action.payload.user.token);
    },
    edit: (state, action) => {
      state.data = action.payload;
      localStorage.setItem("data", JSON.stringify(action.payload));
      localStorage.setItem("image", JSON.stringify(action.payload.user.image));
    },
  },
  extraReducers: {
    [fetchAuth.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.status = "resolved";
      state.data = action.payload;
    },
    [fetchAuth.rejected]: (state) => {
      state.status = "rejected";
      state.data = null;
    },
    [fetchRegister.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchRegister.fulfilled]: (state, action) => {
      state.status = "resolved";
      state.data = action.payload;
    },
    [fetchRegister.rejected]: (state, action) => {
      state.status = "rejected";
      state.data = null;
      state.error = action.payload;
    },
    [fetchEditData.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchEditData.fulfilled]: (state, action) => {
      state.status = "resolved";
      state.data = action.payload;
    },
    [fetchEditData.rejected]: (state) => {
      state.status = "rejected";
      state.data = null;
    },
    [initAuth.fulfilled]: (state, action) => {
      state.status = "resolved";
      state.data = action.payload;
    },
    [initAuth.rejected]: (state) => {
      state.status = "rejected";
      state.data = null;
    },
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const { logout, login, edit } = authSlice.actions;
export default authSlice.reducer;