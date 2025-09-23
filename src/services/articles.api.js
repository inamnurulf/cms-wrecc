import { baseApi } from "./baseApi";

export const articlesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listArticles: build.query({
      query: (params) => ({ url: "/v1/articles", method: "GET", params }),
      providesTags: (res) =>
        res
          ? [
              ...res.items.map((a) => ({ type: "Article", id: a.id })),
              { type: "Articles", id: "LIST" },
            ]
          : [{ type: "Articles", id: "LIST" }],
    }),
    getArticle: build.query({
      query: (id) => ({ url: `/v1/articles/${id}`, method: "GET" }),
      providesTags: (res, err, id) => [{ type: "Article", id }],
    }),
    createArticle: build.mutation({
      query: (body) => ({ url: "/v1/articles", method: "POST", data: body }),
      invalidatesTags: [{ type: "Articles", id: "LIST" }],
    }),
    updateArticle: build.mutation({
      query: ({ id, body }) => ({ url: `/v1/articles/${id}`, method: "PUT", data: body }),
      invalidatesTags: (res, err, { id }) => [{ type: "Article", id }, { type: "Articles", id: "LIST" }],
    }),
    changeStatus: build.mutation({
      query: ({ id, status }) => ({ url: `/v1/articles/${id}/status`, method: "PATCH", data: { status } }),
      invalidatesTags: (res, err, { id }) => [{ type: "Article", id }, { type: "Articles", id: "LIST" }],
    }),
    deleteArticle: build.mutation({
      query: (id) => ({ url: `/v1/articles/${id}`, method: "DELETE" }),
      invalidatesTags: (res, err, id) => [{ type: "Article", id }, { type: "Articles", id: "LIST" }],
    }),
  }),
});

export const {
  useListArticlesQuery,
  useGetArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useChangeStatusMutation,
  useDeleteArticleMutation,
} = articlesApi;
