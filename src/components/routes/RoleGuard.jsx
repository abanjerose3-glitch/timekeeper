import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RoleGuard({ children }) {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RoleGuard;