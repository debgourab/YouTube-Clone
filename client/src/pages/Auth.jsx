import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const initial = { username: "", email: "", identifier: "", password: "" };

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const { user, login, register, loading } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (mode === "register") {
        await register(form);
        setMode("login");
        setForm({ ...initial, identifier: form.email });
      } else {
        await login({ identifier: form.identifier, password: form.password });
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-brand">
          <span className="auth-logo">YT</span>
          <span>YouTube Clone</span>
        </div>
        <h1>{mode === "login" ? "Sign in" : "Create your account"}</h1>
        <p>{mode === "login" ? "Continue to your channel, comments, likes, and uploads." : "Use a username, email, and password for JWT authentication."}</p>
        {mode === "register" && (
          <label>
            Username
            <input value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} minLength="3" required />
          </label>
        )}
        {mode === "register" ? (
          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
        ) : (
          <label>
            Email or username
            <input value={form.identifier} onChange={(event) => setForm({ ...form, identifier: event.target.value })} required />
          </label>
        )}
        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} minLength="8" required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary" disabled={loading}>{loading ? "Please wait..." : mode === "login" ? "Sign in" : "Register"}</button>
        <button type="button" className="text-button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Create an account" : "Already have an account? Sign in"}
        </button>
      </form>
    </main>
  );
}
