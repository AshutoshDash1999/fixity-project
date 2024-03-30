import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseDB } from "../utils/firebaseConfig";

const Login = () => {
  const navigate = useNavigate();

  const [userPhoneNumber, setUserPhoneNumber] = useState("");
  const [loginButtonLoading, setLoginButtonLoading] = useState(false);

  const onPressLogin = async () => {
    try {
      setLoginButtonLoading(true);
      if (userPhoneNumber) {
        // search for document id with phone number from `userData` collection
        const docRef = doc(firebaseDB, "userData", userPhoneNumber);
        const docSnap = await getDoc(docRef);

        // if document exists then redirect user to profile or else redirect to sign up page
        if (docSnap.exists()) {
          sessionStorage.setItem("userDetails", JSON.stringify(docSnap.data()));
          navigate("/profile", {
            state: {
              userDetails: docSnap.data(),
            },
          });
        } else {
          navigate("/signup", {
            state: {
              userPhoneNumber,
            },
          });
        }
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoginButtonLoading(false);
    }
  };

  return (
    <div className="flex-column">
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        id="phoneNumber"
        type="text"
        value={userPhoneNumber}
        onChange={(e) => setUserPhoneNumber(e.target.value)}
      />
      <button onClick={onPressLogin} disabled={loginButtonLoading}>
        Login
      </button>
    </div>
  );
};

export default Login;
