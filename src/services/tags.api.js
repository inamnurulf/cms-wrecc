import { baseApi } from "./baseApi";

export const tagsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listTags: build.query({
      query: (params) => ({ url: "/v1/tags", method: "GET", params }),
      providesTags: [{ type: "Tags", id: "LIST" }],
    }),
    createTag: build.mutation({
      query: (body) => ({ url: "/v1/tags", method: "POST", data: body }),
      invalidatesTags: [{ type: "Tags", id: "LIST" }],
    }),
    updateTag: build.mutation({
      query: ({ id, name }) => ({ url: `/v1/tags/${id}`, method: "PUT", data: { name } }),
      invalidatesTags: [{ type: "Tags", id: "LIST" }],
    }),
    deleteTag: build.mutation({
      query: (id) => ({ url: `/v1/tags/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Tags", id: "LIST" }],
    }),
  }),
});

export const { useListTagsQuery, useCreateTagMutation, useUpdateTagMutation, useDeleteTagMutation } = tagsApi;
