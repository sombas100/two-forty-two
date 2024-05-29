import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaStripe } from "react-icons/fa";

const CheckoutForm = ({ productId, quantity }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const createOrderAndPaymentIntent = async () => {
      try {
        const requestData = {
          products: [{ productId, quantity }],
        };
        console.log("Request data:", requestData);
        const { data } = await axios.post(
          "http://localhost:3000/api/orders",
          {
            products: [{ productId, quantity }],
          },
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
            },
          }
        );
        setClientSecret(data.clientSecret);
        setOrderId(data.orderId);
        console.log("Response Data:", data);
        setError(null);
      } catch (error) {
        console.error("Error creating order:", error);
        if (error.response && error.response.data) {
          setError(error.response.data.message);
        } else {
          setError("Failed to create order");
        }
      }
    };

    createOrderAndPaymentIntent();
  }, [productId, quantity]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      setError(`Payment failed: ${error.message}`);
    } else if (paymentIntent.status === "succeeded") {
      await axios.post(
        "http://localhost:3000/api/payment/confirm-payment",
        {
          paymentIntentId: paymentIntent.id,
          orderId,
        },
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );

      setSuccess(true);
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <label>
        Card Number
        <CardElement className="card-element" />
      </label>
      <label>
        Name on Card
        <input type="text" name="name" className="input-field" required />
      </label>
      <label>
        Sort Code
        <input type="text" name="sort" className="input-field" required />
      </label>
      <label>
        Expiry Date
        <input
          placeholder="dd-mm-yyyy"
          type="number"
          name="expiry"
          className="input-field"
          required
        />
      </label>
      <button type="submit" disabled={!stripe || isLoading} className="pay-btn">
        <FaStripe size={30} className="stripe-icon" />
        {isLoading ? "Processing..." : "Pay"}
      </button>
      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">Payment successful!</div>}
    </form>
  );
};

export default CheckoutForm;
