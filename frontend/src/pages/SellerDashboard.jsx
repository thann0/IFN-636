import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    setLoading(true);
    api.get('/products/mine')
      .then((res) => setProducts(res.data.products))
      .catch(() => setError('Failed to load your listings.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const totalSales = products.reduce((sum, p) => sum + (p.salesCount || 0), 0);

  return (
    <div className="page">
      <div className="dashboard-header">
        <h2>Your Product Listings</h2>
        <Link to="/products/new" className="btn-primary">+ Add New Template</Link>
      </div>

      <div className="key-stats">
        <div className="stat"><span>Total Listings</span><strong>{products.length}</strong></div>
        <div className="stat"><span>Total Sales</span><strong>{totalSales}</strong></div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <div className="message error">{error}</div>}
      {!loading && products.length === 0 && (
        <p>No products yet. <Link to="/products/new">Create new product</Link></p>
      )}

      {products.length > 0 && (
        <table className="data-table">
          <thead>
            <tr><th>Product</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.category}</td>
                <td>AUD ${p.price}</td>
                <td>{p.status}</td>
                <td>
                  <Link to={`/products/${p._id}/edit`}>Edit</Link>{' '}
                  <button onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
