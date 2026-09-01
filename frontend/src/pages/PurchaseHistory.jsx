import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import '../styles/PurchaseHistory.css';

export default function PurchaseHistory() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/purchases/mine')
      .then((res) => setPurchases(res.data.purchases))
      .catch(() => setError('Failed to load purchase history.'));

    // Wishlist is a local-only convenience feature, not part of the backend.
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(savedWishlist);
  }, []);

  const handleAccessFile = async (purchaseId) => {
    try {
      const { data } = await api.get(`/purchases/${purchaseId}/file`);
      window.open(data.fileUrl, '_blank');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to access file.');
    }
  };

  return (
    <div className="purchase-history-page">
      <section className="purchase-history-panel">

        <div className="history-header">
          <h1>Hi {user?.name || 'there'}</h1>
          <p>View Product History</p>
        </div>

        {error && <p className="history-error">{error}</p>}

        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length > 0 ? (
                purchases.map((p) => (
                  <tr key={p._id}>
                    <td>{p.product?.title || 'Product removed'}</td>
                    <td>{p.product?.category || '-'}</td>
                    <td>AUD ${p.priceAtPurchase}</td>
                    <td>Completed</td>
                    <td>
                      <button
                        type="button"
                        className="history-file-link"
                        onClick={() => handleAccessFile(p._id)}
                      >
                        View here
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="history-empty-row">
                    No purchases yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="wishlist-section">
          <div className="wishlist-heading">
            <h2>View Wishlist</h2>
            <i className="ri-shopping-cart-2-line"></i>
          </div>

          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.length > 0 ? (
                  wishlist.map((product) => (
                    <tr key={product._id}>
                      <td>{product.title}</td>
                      <td>{product.category}</td>
                      <td>AUD ${product.price}</td>
                      <td>Wishlist</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="history-empty-row">
                      No products in wishlist.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </section>
    </div>
  );
}
