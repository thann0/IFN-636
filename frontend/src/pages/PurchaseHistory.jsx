import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function PurchaseHistory() {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/purchases/mine')
      .then((res) => setPurchases(res.data.purchases))
      .catch(() => setError('Failed to load purchase history.'));
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
    <div className="page">
      <h2>Purchase History</h2>
      {error && <div className="message error">{error}</div>}
      {purchases.length === 0 && <p>You haven't purchased anything yet.</p>}
      <table className="data-table">
        <thead>
          <tr><th>Product</th><th>Category</th><th>Price</th><th>Date</th><th>Access</th></tr>
        </thead>
        <tbody>
          {purchases.map((p) => (
            <tr key={p._id}>
              <td>{p.product?.title || 'Product removed'}</td>
              <td>{p.product?.category || '-'}</td>
              <td>AUD ${p.priceAtPurchase}</td>
              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              <td><button onClick={() => handleAccessFile(p._id)}>View File</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
