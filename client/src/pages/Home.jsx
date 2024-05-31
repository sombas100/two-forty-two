import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { Link } from "react-router-dom";
const Home = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [products, SetProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      SetProducts(res.data);
    } catch (error) {
      console.error("There was an error fetching the products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="products-container">
      <h1 className="mb-5">Best Sellers</h1>
      <ul className="products-grid">
        {products.map((product) => (
          <li className="product-card" key={product._id}>
            <Link to={`/products/${product._id}`} className="product-link">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <img className="product-image" alt="image" src={product.image} />
              <p className="product-price">Price: £{product.price}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
