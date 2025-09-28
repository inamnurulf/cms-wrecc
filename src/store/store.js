import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../services/baseApi";
import authReducer from "./slices/auth.slice";
import articlesReducer from "./slices/articles.slice";
import publicFilesReducer from "./slices/publicFiles.slice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    article: articlesReducer,
    publicFiles: publicFilesReducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});
