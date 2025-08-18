import { Navigate } from "react-router-dom";

const Users = () => {
  // Redirect to Settings admin tab since user management is now consolidated there
  return <Navigate to="/settings?tab=admin" replace />;
};

export default Users;