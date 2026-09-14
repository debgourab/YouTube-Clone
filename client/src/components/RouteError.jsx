import { isRouteErrorResponse, useRouteError } from "react-router-dom";
export default function RouteError() {
  const error = useRouteError();
  return <main className="status-page"><div>
    <h1>{isRouteErrorResponse(error) && error.status === 404 ? "Page not found" : "This page couldn’t load"}</h1>
    <p>Please try again. If the app was just updated, reloading will fetch the new version.</p>
    <a className="primary-link" href="/">Reload home</a>
  </div></main>;
}
