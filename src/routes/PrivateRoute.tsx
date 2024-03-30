import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Outlet } from "react-router-dom";
import { firebaseApp } from "../utils/firebaseConfig";

const PrivateRoute = () => {
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  return userDetails?.name ? <Outlet /> : <Navigate to={"/"} />;
};
export default PrivateRoute;
