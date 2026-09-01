import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/SellerDashboard.css';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    setLoading(true);
    api
      .get('/products/mine')
      .then((res) => setProducts(res.data.products))
      .catch(() => setError('Failed to load your listings.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  return (
    <div className="seller-dashboard-page">
      <section className="seller-dashboard-panel">

        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name || 'Seller'}!</h1>
            <p>Track your template performance and manage your product listings.</p>
          </div>
          <Link to="/products/new" className="dashboard-add-button">
            <i className="ri-add-line"></i>
            Add New Template
          </Link>
        </div>

        <div className="dashboard-stats">
          <div className="dashboard-stat">
            <span>Total Listings</span>
            <strong>{products.length}</strong>
          </div>
          <div className="dashboard-stat">
            <span>Published</span>
            <strong>{products.filter((p) => p.status === 'published').length}</strong>
          </div>
          <div className="dashboard-stat">
            <span>Drafts</span>
            <strong>{products.filter((p) => p.status === 'draft').length}</strong>
          </div>
        </div>

        {loading && <p className="dashboard-status">Loading...</p>}
        {error && <p className="dashboard-status dashboard-error">{error}</p>}

        {!loading && products.length === 0 && (
          <div className="dashboard-empty">
            <i className="ri-file-add-line"></i>
            <p>No products yet.</p>
            <Link to="/products/new">Create new product</Link>
          </div>
        )}

        {products.length > 0 && (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td>{p.category}</td>
                    <td>AUD ${p.price}</td>
                    <td>
                      <span className={`dashboard-status-badge dashboard-status-${p.status}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="dashboard-actions">
                      <Link to={`/products/${p._id}/edit`}>Edit</Link>
                      <button type="button" onClick={() => handleDelete(p._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </section>
    </div>
  );
}
