import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import Shop from "./pages/shop/Shop";
import AutoLogout from "./components/AutoLogout";

function App() {
  const [isAuthenticated, SetIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      SetIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    SetIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    SetIsAuthenticated(false);
    window.location.href = "/login";
  };
  return (
    <BrowserRouter>
      <AutoLogout />
      <Header isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/shop" element={<Shop />}></Route>
        <Route path="/login" element={<Login onLogin={handleLogin} />}></Route>
        <Route
          path="/register"
          element={<Register onLogin={handleLogin} />}
        ></Route>
        <Route path="/profile" element={<Profile />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
