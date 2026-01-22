import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // depois podemos colocar um loader
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
