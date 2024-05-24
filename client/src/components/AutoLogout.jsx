import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AutoLogout = () => {
  const [logoutTimer, setLogoutTimer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    if (tokenExpiry) {
      const expiryTime = new Date(tokenExpiry).getTime();
      const currentTime = new Date().getTime();
      const remainingTime = expiryTime - currentTime;

      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          navigate("/login");
        }, remainingTime);

        setLogoutTimer(timer);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    clearTimeout(logoutTimer);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    navigate("/login");
  };
  return null;
};

export default AutoLogout;
