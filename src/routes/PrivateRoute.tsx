import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "");
  // if userDetails doesnt exist then redirect user to login route
  return userDetails?.name ? <Outlet /> : <Navigate to={"/"} />;
};
export default PrivateRoute;
