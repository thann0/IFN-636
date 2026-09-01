import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Checkout.css';

export default function Checkout() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [purchase, setPurchase] = useState(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => setError('Product not found.'));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');
    try {
      // This is a simulated checkout: the form fields above are for the
      // demonstrated UX flow, but no real payment is processed. The backend
      // records the purchase and grants file access.
      const { data } = await api.post('/purchases', { productId: id });
      setPurchase(data.purchase);
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed.');
    } finally {
      setProcessing(false);
    }
  };

  if (error && !product) {
    return <div className="checkout-not-found">{error}</div>;
  }

  if (!product) {
    return <div className="checkout-not-found">Loading...</div>;
  }

  return (
    <div className="checkout-page">
      <div className="checkout-layout">

        {/* LEFT PRODUCT CARD */}
        <section className="checkout-product-card">
          <div className="checkout-product-content">
            <h1>{product.title}</h1>

            <p className="checkout-product-description">
              {product.description}
            </p>

            <div className="checkout-product-middle">
              <div className="checkout-seller">
                <div className="checkout-avatar">
                  <i className="ri-user-3-fill"></i>
                </div>
                <span>{product.seller?.name || 'Unknown seller'}</span>
              </div>

              <div className="checkout-product-price">
                AUD ${product.price}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT ORDER SUMMARY */}
        <section className="checkout-summary-card">
          <h2>Order Summary</h2>

          <div className="checkout-subtotal-title">Subtotal</div>

          <div className="checkout-summary-row">
            <span className="checkout-quantity">1x</span>
            <span className="checkout-summary-product">{product.title}</span>
            <span className="checkout-summary-price">AUD ${product.price}</span>
          </div>

          <div className="checkout-total-row">
            <span>Total</span>
            <span>AUD ${product.price}</span>
          </div>

          {error && <p className="checkout-error">{error}</p>}

          {!purchase ? (
            <form className="checkout-form" onSubmit={handleConfirm}>
              <div className="checkout-field">
                <label htmlFor="email">Delivery Email</label>
                <div className="checkout-input-box">
                  <i className="ri-mail-line"></i>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter the email address"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="cardNumber">Payment</label>
                <div className="checkout-input-box">
                  <i className="ri-bank-card-line"></i>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    placeholder="Enter card number (simulated)"
                    value={form.cardNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="checkout-small-fields">
                <div className="checkout-expiry-row">
                  <label htmlFor="expiry">Expiration Date</label>
                  <input
                    id="expiry"
                    name="expiry"
                    type="text"
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={handleChange}
                    maxLength="5"
                    required
                  />
                </div>

                <div className="checkout-cvv-row">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    id="cvv"
                    name="cvv"
                    type="password"
                    value={form.cvv}
                    onChange={handleChange}
                    maxLength="4"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="checkout-confirm-button" disabled={processing}>
                {processing ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </form>
          ) : (
            <div className="checkout-success-state">
              <div className="checkout-success-icon">
                <i className="ri-check-line"></i>
              </div>

              <div className="checkout-success-text">
                <h3>Order Successful</h3>
                <p>Your purchase is complete.</p>
                <a href={purchase.fileUrlSnapshot} target="_blank" rel="noopener noreferrer">
                  View URL here
                </a>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
