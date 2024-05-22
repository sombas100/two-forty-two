import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [products, SetProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/products");
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
      <h1 className="mb-5">Products</h1>
      <ul className="products-grid">
        {products.map((product) => (
          <li className="product-card" key={product._id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <img className="product-image" alt="image" src={product.image} />
            <p className="product-price">Price: £{product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
