import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://two-forty-two.onrender.com/api/profile",
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setProfile(res.data.user);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsLoading(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  return (
    <div className="profile-body d-flex flex-column justify-content-center align-items-center profile-container">
      <div className="container">
        <h1>Profile</h1>
        <img
          style={{
            borderRadius: "50%",
            paddingLeft: "8px",
            border: "solid 2px",
            marginTop: "17px",
          }}
          alt="profile"
          src={
            profile.image ||
            "data:image/jpeg;base64,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"
          }
        />
        <p>Email: {profile.email}</p>
      </div>
    </div>
  );
};

export default Profile;
