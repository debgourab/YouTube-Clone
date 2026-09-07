import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="status-page">
      <h1>Page not found</h1>
      <p>The video, channel, or page you requested is not available.</p>
      <Link className="primary-link" to="/">Back to Home</Link>
    </main>
  );
}
