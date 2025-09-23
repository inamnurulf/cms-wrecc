import { baseApi } from "./baseApi";

export const imagesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadImage: build.mutation({
      query: ({ file, article_id }) => {
        const form = new FormData();
        form.append("headerImage", file); // field name matches your multer setup
        if (article_id) form.append("article_id", String(article_id));
        return { url: "/v1/images", method: "POST", data: form, headers: { "Content-Type": "multipart/form-data" } };
      },
      invalidatesTags: [{ type: "Images", id: "LIST" }, { type: "Articles", id: "LIST" }],
    }),
    deleteImage: build.mutation({
      query: (id) => ({ url: `/v1/images/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Images", id: "LIST" }, { type: "Articles", id: "LIST" }],
    }),
  }),
});

export const { useUploadImageMutation, useDeleteImageMutation } = imagesApi;
