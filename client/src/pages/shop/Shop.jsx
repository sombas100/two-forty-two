import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import axios from "axios";
import "./Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const fetchProducts = async (req, res) => {
    try {
      const res = await axios.get(`${VITE_API_URL}/products/shop`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="shop-container">
      <h1 className="pb-5">Offers</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
