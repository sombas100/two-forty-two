import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import "./Header.css";
import { PiShoppingCartSimpleFill } from "react-icons/pi";

import { CgProfile } from "react-icons/cg";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Header = ({ isAuthenticated, handleLogout, basketCount }) => {
  const [image, setImage] = useState(
    "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg"
  );
  const navigate = useNavigate();
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${VITE_API_URL}/profile`, {
        headers: {
          "x-auth-token": token,
        },
      });

      setImage(
        res.data.image ||
          "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg"
      );
    } catch (error) {
      console.error("Error fetching the profile:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleBasketClick = () => {
    navigate("/cart");
  };
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand className="me-9 pe-5" href="/">
          2<span className="forty">4</span>2
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link className="pe-4" href="/">
            Home
          </Nav.Link>
          <Nav.Link href="/shop">Shop</Nav.Link>
        </Nav>
        <div className="search-input">
          <IoIosSearch size={25} />
          <Form.Control type="search" id="search" placeholder="Search..." />
        </div>
        <div>
          <Nav>
            {isAuthenticated ? (
              <Nav.Link as="button" onClick={handleLogout}>
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </Nav>
        </div>
        <div className="ms-3">
          {isAuthenticated ? (
            <img
              src={image}
              alt="profile"
              onClick={() => navigate("/profile")}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            />
          ) : (
            <CgProfile
              onClick={handleProfileClick}
              size={30}
              className="profile-icon"
            />
          )}
        </div>
        <div className="ms-3 ps-4 basket-container">
          <PiShoppingCartSimpleFill
            onClick={handleBasketClick}
            size={30}
            className="basket-icon"
          />
          {basketCount > 0 && (
            <span className="basket-count">{basketCount}</span>
          )}
        </div>
      </Container>
    </Navbar>
  );
};
export default Header;
