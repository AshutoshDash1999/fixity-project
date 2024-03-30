import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "");
  return userDetails?.name ? <Outlet /> : <Navigate to={"/"} />;
};
export default PrivateRoute;
