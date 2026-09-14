// Storage can be unavailable in private browsing. Keep this tab functional.
let token = "";
try { token = localStorage.getItem("yt_token") || ""; } catch { /* use memory */ }
export const getToken = () => token;
export function saveToken(value) {
  token = value || "";
  try {
    if (token) localStorage.setItem("yt_token", token);
    else localStorage.removeItem("yt_token");
    localStorage.removeItem("yt_user");
  } catch { /* the in-memory session remains usable */ }
}
