import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "./store/index.js";
import { router } from "./router.jsx";
import { clearSession, restoreSession } from "./store/authSlice.js";
import { videosApi } from "./store/videosApi.js";
import "./styles.css";

// Restore once, outside StrictMode's development effect replay.
store.dispatch(restoreSession());
window.addEventListener("session-expired", () => {
  store.dispatch(clearSession());
  store.dispatch(videosApi.util.resetApiState());
});
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
