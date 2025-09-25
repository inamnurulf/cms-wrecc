import { baseApi } from "./baseApi";

/** Helper to strip empty params so URLs stay clean */
const compactParams = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== "" // keep 0 and false
    )
  );

export const articleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** GET /v1/articles?status=&tag_id=&category_id=&q=&page=&limit= */
    listArticles: build.query({
      query: (params) => ({
        url: "/v1/articles",
        method: "GET",
        params: compactParams({
          status: params?.status,
          tag_id: params?.tag_id,
          category_id: params?.category_id,
          q: params?.q,
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        }),
      }),
      providesTags: (result) => {
        const base = [{ type: "Articles", id: "LIST" }];
        const byId =
          result?.items?.map?.((a) => ({ type: "Articles", id: a.id })) ?? [];
        return [...base, ...byId];
      },
    }),

    /** GET /v1/articles/:id */
    getArticleById: build.query({
      query: (id) => ({ url: `/v1/articles/${id}`, method: "GET" }),
      providesTags: (res, _e, id) => [{ type: "Articles", id }],
    }),

    getArticleStats: build.query({
      query: (params) => ({ url: "/v1/articles/stats", params }),
      providesTags: [{ type: "Articles", id: "STATS" }],
    }),

    /** POST /v1/articles (auth) */
    createArticle: build.mutation({
      query: (body) => ({
        url: "/v1/articles",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [
        { type: "Articles", id: "LIST" },
        { type: "Articles", id: "STATS" },
      ],
    }),

    /** PUT /v1/articles/:id (auth) */
    updateArticle: build.mutation({
      query: ({ id, body }) => ({
        url: `/v1/articles/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (res, _e, arg) => [
        { type: "Articles", id: "LIST" },
        { type: "Articles", id: arg.id },
        { type: "Articles", id: "STATS" },
      ],
    }),

    /** PATCH /v1/articles/:id/status (auth) */
    changeArticleStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/v1/articles/${id}/status`,
        method: "PATCH",
        data: { status },
      }),
      // light optimistic update
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          articleApi.util.updateQueryData("getArticleById", id, (draft) => {
            if (draft) draft.status = status;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: (res, _e, arg) => [
        { type: "Articles", id: "LIST" },
        { type: "Articles", id: arg.id },
        { type: "Articles", id: "STATS" },
      ],
    }),

    /** DELETE /v1/articles/:id (auth) */
    deleteArticle: build.mutation({
      query: (id) => ({ url: `/v1/articles/${id}`, method: "DELETE" }),
      invalidatesTags: (res, _e, id) => [
        { type: "Articles", id: "LIST" },
        { type: "Articles", id },
        { type: "Articles", id: "STATS" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListArticlesQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useGetArticleStatsQuery,
  useUpdateArticleMutation,
  useChangeArticleStatusMutation,
  useDeleteArticleMutation,
} = articleApi;
