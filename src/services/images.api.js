// /src/services/images.api.js
import { baseApi } from "./baseApi";

export const imagesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** POST /v1/images (multipart/form-data: file, article_id?) */
    uploadImage: build.mutation({
      query: ({ file, article_id }) => {
        const form = new FormData();
        form.append("file", file);
        form.append("article_id", String(article_id)); // required now
        return { url: "/v1/images", method: "POST", data: form };
      },
      transformResponse: (res) => res, // res has { id, url, ... }
    }),

    /** DELETE /v1/images/:id */
    deleteImage: build.mutation({
      query: (id) => ({
        url: `/v1/images/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _e, id) => [
        { type: "Images", id },
        { type: "Images", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useUploadImageMutation, useDeleteImageMutation } = imagesApi;

/** Helper: build a preview URL for an image id */
// Prefer the same-origin proxy to avoid CORP blocks.
// Falls back to absolute API URL if proxy is disabled.
export const getImageUrl = (id) => {
  const viaProxy = String(process.env.NEXT_PUBLIC_IMAGE_VIA_PROXY || "true") === "true";
  if (viaProxy) return `/media/${id}`;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/v1/images/${id}`;
};

