import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { BiSolidTrashAlt } from "react-icons/bi";

import "./Cart.css";

const Cart = () => {
  const [basket, setBasket] = useState([]);
  const navigate = useNavigate();

  const fetchBasketItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, please log in first.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/api/basket", {
        headers: { "x-auth-token": token },
      });
      setBasket(res.data.basket);
    } catch (error) {
      console.error("Error fetching basket items:", error);
    }
  };

  useEffect(() => {
    fetchBasketItems();
  }, []);

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, please log in first.");
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:3000/api/basket/${productId}`,
        {
          headers: { "x-auth-token": token },
        }
      );
      if (res.status === 200) {
        setBasket((prevBasket) =>
          prevBasket.filter((item) => item.productId._id !== productId)
        );
      }
    } catch (error) {
      console.error("Error deleting the item from the basket:", error);
    }
  };

  const handleCheckout = () => {
    // checkout logic pending...
    console.log("Proceeding to checkout...");
  };

  const handleGoToBasket = () => {
    navigate("/basket");
  };
  const handleGoToShop = () => {
    navigate("/shop");
  };

  const totalPrice = basket.reduce(
    (total, item) => total + item.productId.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1 className="mb-5">Your Basket</h1>
      <div className="cart-items">
        {basket.map((item, index) => (
          <div className="cart-item" key={`${item.productId._id}-${index}`}>
            <img
              src={item.productId.image}
              alt={item.productId.name}
              className="cart-item-image"
            />
            <div className="cart-items-details">
              <h3>{item.productId.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: £{item.productId.price}</p>
              <Button
                className="w-6 h-6 pe-1 px-1 pt-0"
                size="sm"
                variant="danger"
                onClick={() => handleDelete(item.productId._id)}
              >
                <BiSolidTrashAlt />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-actions">
        <h2>Subtotal: £{totalPrice.toFixed(2)}</h2>
        <Button
          variant="outline-primary"
          onClick={handleCheckout}
          className="checkout-button"
        >
          Proceed to Checkout
        </Button>
        <Button
          variant="warning"
          onClick={handleGoToShop}
          className="basket-button"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default Cart;
