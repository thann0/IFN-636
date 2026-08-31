import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data.product)).catch(() => setError('Product not found.'));
  }, [id]);

  const handleConfirm = async () => {
    setProcessing(true);
    setError('');
    try {
      const { data } = await api.post('/purchases', { productId: id });
      setSuccess(data.purchase);
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed.');
    } finally {
      setProcessing(false);
    }
  };

  if (error && !product) return <div className="message error">{error}</div>;
  if (!product) return <p>Loading...</p>;

  if (success) {
    return (
      <div className="page checkout-success">
        <h2>Order Successful</h2>
        <p>Your purchase of "{product.title}" is complete.</p>
        <button onClick={() => navigate('/purchases')}>View Purchase History</button>
      </div>
    );
  }

  return (
    <div className="page checkout">
      <h2>Simulated Checkout</h2>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <p>{product.title} &mdash; AUD ${product.price}</p>
        <p><strong>Total: AUD ${product.price}</strong></p>
      </div>
      {error && <div className="message error">{error}</div>}
      <button onClick={handleConfirm} disabled={processing}>
        {processing ? 'Processing...' : 'Confirm Purchase'}
      </button>
    </div>
  );
}
