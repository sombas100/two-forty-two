import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Shop from "./pages/shop/Shop";
import AutoLogout from "./components/AutoLogout";
import ItemDescription from "./pages/ItemDescription";
import Cart from "./pages/cart/Cart";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [basketCount, setBasketCount] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
          setUser(decodedToken);
          setBasketCount(
            decodedToken.basket && decodedToken.basket.items
              ? decodedToken.basket.items.length
              : 0
          );
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        handleLogout();
      }
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            handleLogout();
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          handleLogout();
        }
      }
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
        setBasketCount(
          decodedToken.basket && decodedToken.basket.items
            ? decodedToken.basket.items.length
            : 0
        );
      } catch (error) {
        console.error("Failed to decode token:", error);
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    setBasketCount(0);
    window.location.href = "/login";
  };

  const updateBasketCount = (newCount) => {
    setBasketCount(newCount);
  };

  return (
    <BrowserRouter>
      <AutoLogout />
      <Header
        basketCount={basketCount}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/shop" element={<Shop />}></Route>
        <Route path="/login" element={<Login onLogin={handleLogin} />}></Route>
        <Route
          path="/register"
          element={<Register onLogin={handleLogin} />}
        ></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route
          path="/products/:productId"
          element={<ItemDescription updateBasketCount={updateBasketCount} />}
        ></Route>
        <Route path="/cart" element={<Cart />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
