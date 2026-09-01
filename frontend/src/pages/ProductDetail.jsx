import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => setError('Product not found.'));
  }, [id]);

  const handlePurchase = () => {
    if (!user) return navigate('/login');
    navigate(`/checkout/${id}`);
  };

  const handleWishlist = () => {
    // Wishlist is a local convenience feature only (not part of the backend data model).
    const existingWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const alreadyWishlisted = existingWishlist.some(
      (item) => String(item._id) === String(product._id)
    );
    if (!alreadyWishlisted) {
      localStorage.setItem('wishlist', JSON.stringify([...existingWishlist, product]));
    }
    navigate('/purchases');
  };

  if (error) {
    return (
      <div className="product-detail-page">
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-layout">

        {/* LEFT SIDE */}
        <section className="product-gallery">
          <div className="product-gallery-panel">
            <div className="product-main-image product-main-image-placeholder">
              <i className="ri-file-text-line"></i>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="product-info">
          <h1>{product.title}</h1>

          <p className="product-description">
            {product.description}
          </p>

          <div className="product-seller-price-row">
            <div className="product-seller">
              <div className="seller-avatar">
                <i className="ri-user-3-fill"></i>
              </div>
              <span>{product.seller?.name || 'Unknown seller'}</span>
            </div>

            <div className="product-detail-price">
              AUD ${product.price}
            </div>
          </div>

          <div className="product-meta-row">
            <span>{product.category} &middot; {product.fileFormat}</span>
          </div>

          <div className="product-action-row">
            {(!user || user.role === 'customer') && (
              <button
                type="button"
                className="product-purchase-button"
                onClick={handlePurchase}
              >
                Purchase Now
              </button>
            )}

            {(!user || user.role === 'customer') && (
              <button
                type="button"
                className="product-wishlist-button"
                onClick={handleWishlist}
              >
                <i className="ri-shopping-cart-2-line"></i>
                Wishlist
              </button>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
