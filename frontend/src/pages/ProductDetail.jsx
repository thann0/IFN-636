import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => setError('Product not found.'));
  }, [id]);

  const handlePurchase = () => {
    if (!user) return navigate('/login');
    navigate(`/checkout/${id}`);
  };

  if (error) return <div className="message error">{error}</div>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="page product-detail">
      <h2>{product.title}</h2>
      <p className="category">{product.category} &middot; {product.fileFormat}</p>
      <p>{product.description}</p>
      <p className="price">AUD ${product.price}</p>
      <p className="seller">Sold by {product.seller?.name}</p>
      {(!user || user.role === 'customer') && (
        <button onClick={handlePurchase}>Purchase Now</button>
      )}
    </div>
  );
}
