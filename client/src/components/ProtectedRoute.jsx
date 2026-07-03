import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Wraps any page that needs login
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
