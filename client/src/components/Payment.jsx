import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import CheckoutForm from "./CheckoutForm";
import "./Payment.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Payment = ({ productId, quantity }) => {
  const [products, setProducts] = useState([]);
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  console.log("Product ID:", productId);
  console.log("Quantity:", quantity);

  const fetchBasketItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, please log in first");
        return;
      }

      const res = await axios.get(`${VITE_API_URL}/basket`, {
        headers: { "x-auth-token": token },
      });

      setProducts(res.data.basket);
    } catch (error) {
      console.error("Error fetching the basket items:", error);
    }
  };

  useEffect(() => {
    fetchBasketItems();
  }, []);

  return (
    <div>
      {products.map((product) => (
        <div key={product._id}>
          <p>{product.name}</p>
          <p>{product.price}</p>
        </div>
      ))}
      <Elements stripe={stripePromise}>
        <CheckoutForm productId={productId} quantity={quantity} />
      </Elements>
    </div>
  );
};

export default Payment;
