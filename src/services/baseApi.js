import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../lib/axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    prepareHeaders: (headers, { getState }) => headers // you can customize further
  }),
  tagTypes: ["Auth", "Articles", "Article", "Tags", "Images", "PublicFiles"],
  endpoints: () => ({}),
});
