import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ItemDescription.css";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

const ItemDescription = ({ updateBasketCount }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/products/${productId}`
      );
      setProduct(res.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleAddToBasket = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, please log in first.");
      return;
    }
    if (quantity != null) {
      const newItem = {
        productId: product._id,
        quantity: quantity,
      };
      axios
        .post("http://localhost:3000/api/basket", newItem, {
          headers: {
            "x-auth-token": token,
          },
        })
        .then((res) => {
          console.log("Item added to basket:", res.data);
          if (res.data.items) {
            updateBasketCount(res.data.items.length);
          } else {
            console.error("Basket items data not found in response");
          }
        })
        .catch((err) => {
          console.error("Error adding item to basket", err);
        });
    }
  };

  if (!product) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  return (
    <div className="item-description-container">
      <div className="item-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="item-details">
        <h2>{product.name}</h2>
        <p>Description: {product.description}</p>
        <p>Price: £{product.price}</p>
        <div className="quantity-container">
          <label htmlFor="quantity">Quantity:</label>
          <input
            style={{ borderRadius: "7px" }}
            type="number"
            id="quantity"
            value={quantity}
            min="1"
            max={product.stock}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <Button
          className="w-100"
          type="button"
          variant="secondary"
          onClick={handleAddToBasket}
        >
          Add to Basket
        </Button>
      </div>
    </div>
  );
};

export default ItemDescription;
