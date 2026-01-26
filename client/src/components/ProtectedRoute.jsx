import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth";
import Container from "./Layout/Container";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Container>
        <div className="p-4 rounded-2xl border bg-white text-sm text-gray-500">
          Carregando...
        </div>
      </Container>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
