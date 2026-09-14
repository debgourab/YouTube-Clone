import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice.js";
import ui from "./uiSlice.js";
import { videosApi } from "./videosApi.js";

export const store = configureStore({
  reducer: { auth, ui, [videosApi.reducerPath]: videosApi.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(videosApi.middleware)
});
