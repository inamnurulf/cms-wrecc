import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../services/baseApi";
import authReducer from "./slices/auth.slice";
import articlesReducer from "./slices/articles.slice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    article: articlesReducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});
