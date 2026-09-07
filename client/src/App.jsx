import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import Watch from "./pages/Watch.jsx";
import Channel from "./pages/Channel.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const Protected = ({ children }) => {
  const { user, initializing } = useAuth();
  if (initializing) return <main className="status-page">Checking your session...</main>;
  return user ? children : <Navigate to="/auth" replace />;
};

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/channel/:id" element={<Channel />} />
        <Route path="/studio" element={<Protected><Channel studio /></Protected>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
