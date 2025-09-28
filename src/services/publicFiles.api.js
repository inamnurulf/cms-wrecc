import { baseApi } from "./baseApi";

/** Keep URLs clean (preserve 0/false) */
const compactParams = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

export const publicFilesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** GET /v1/public-files?q=&published=&page=&limit=&sort= */
    listPublicFiles: build.query({
      query: (params) => ({
        url: "/v1/public-files",
        method: "GET",
        params: compactParams({
          q: params?.q,
          published: params?.published, // "true" | "false" | "all"
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          sort: params?.sort ?? "created_desc", // created_desc|created_asc|title_asc|title_desc
        }),
      }),
      transformResponse: (resp) => resp?.data ?? resp, // support { data: {...} } or plain
      providesTags: (result) => {
        const listTag = [{ type: "PublicFiles", id: "LIST" }];
        const itemTags =
          result?.items?.map?.((r) => ({ type: "PublicFiles", id: r.id })) ??
          [];
        return [...listTag, ...itemTags];
      },
    }),

    /** GET /v1/public-files/:id */
    getPublicFileById: build.query({
      query: (id) => ({ url: `/v1/public-files/${id}`, method: "GET" }),
      transformResponse: (resp) => resp?.data ?? resp,
      providesTags: (res, _e, id) => [{ type: "PublicFiles", id }],
    }),

    /** POST /v1/public-files (auth) */
    createPublicFile: build.mutation({
      query: (body) => ({
        url: "/v1/public-files",
        method: "POST",
        data: body, // { title, slug, description, drive_link, is_published?, metadata? }
      }),
      transformResponse: (resp) => resp?.data ?? resp,
      invalidatesTags: [{ type: "PublicFiles", id: "LIST" }],
    }),

    /** PUT /v1/public-files/:id (auth) – partial or full update */
    updatePublicFile: build.mutation({
      query: ({ id, body }) => ({
        url: `/v1/public-files/${id}`,
        method: "PUT",
        data: body,
      }),
      transformResponse: (resp) => resp?.data ?? resp,
      invalidatesTags: (res, _e, arg) => [
        { type: "PublicFiles", id: "LIST" },
        { type: "PublicFiles", id: arg.id },
      ],
    }),

    /** PATCH /v1/public-files/:id/publish (auth) – set is_published */
    setPublicFilePublished: build.mutation({
      query: ({ id, is_published }) => ({
        url: `/v1/public-files/${id}/publish`,
        method: "PATCH",
        data: { is_published },
      }),
      // Optimistic toggle
      async onQueryStarted({ id, is_published }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          publicFilesApi.util.updateQueryData(
            "getPublicFileById",
            id,
            (draft) => {
              if (draft) draft.is_published = is_published;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: (res, _e, arg) => [
        { type: "PublicFiles", id: "LIST" },
        { type: "PublicFiles", id: arg.id },
      ],
    }),

    /** DELETE /v1/public-files/:id (auth) */
    deletePublicFile: build.mutation({
      query: (id) => ({ url: `/v1/public-files/${id}`, method: "DELETE" }),
      invalidatesTags: (res, _e, id) => [
        { type: "PublicFiles", id: "LIST" },
        { type: "PublicFiles", id },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useListPublicFilesQuery,
  useGetPublicFileByIdQuery,
  useCreatePublicFileMutation,
  useUpdatePublicFileMutation,
  useSetPublicFilePublishedMutation,
  useDeletePublicFileMutation,
} = publicFilesApi;
