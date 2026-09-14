import { createApi } from "@reduxjs/toolkit/query/react";
import api, { errorMessage } from "../api.js";

// Share the existing Axios authentication and timeout policy with RTK Query.
export const videosApi = createApi({
  reducerPath: "videosApi",
  baseQuery: async ({ url, params }, { signal }) => {
    try {
      const { data } = await api.get(url, { params, signal });
      if (!Array.isArray(data)) return { error: { status: "INVALID_RESPONSE", message: "The server returned an invalid video list." } };
      return { data };
    } catch (error) {
      return { error: { status: error.response?.status || "FETCH_ERROR", message: errorMessage(error, "Could not load videos. Please try again.") } };
    }
  },
  tagTypes: ["Videos"],
  endpoints: (builder) => ({
    getVideos: builder.query({
      query: (params) => ({ url: "/videos", params }),
      providesTags: ["Videos"],
      keepUnusedDataFor: 60
    })
  })
});

export const { useGetVideosQuery } = videosApi;
