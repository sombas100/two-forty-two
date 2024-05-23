import React from "react";
import Button from "react-bootstrap/Button";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OAuth = ({ onLogin }) => {
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultsFromGoogle);
      const idToken = await resultsFromGoogle.user.getIdToken();

      const res = await axios.post("http://localhost:3000/api/auth/google", {
        idToken,
      });

      const { token } = res.data;
      localStorage.setItem("token", token);

      onLogin();
      navigate("/");
      console.log(res.data);
    } catch (error) {
      console.log("Error during Google authentication", error);
    }
  };
  return (
    <Button
      type="button"
      variant="outline-info"
      className="w-100"
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-7 h-7 my-2 mx-3" />
      Continue with Google
    </Button>
  );
};

export default OAuth;
