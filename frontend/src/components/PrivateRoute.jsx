import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
