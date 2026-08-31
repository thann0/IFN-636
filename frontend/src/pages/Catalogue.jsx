import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Catalogue() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async (cat) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/products', { params: cat ? { category: cat } : {} });
      setProducts(data.products);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const categories = [...new Set(products.map((p) => p.category))];

  const handleFilter = (cat) => {
    setCategory(cat);
    loadProducts(cat);
  };

  return (
    <div className="page">
      <h2>Browse Templates</h2>

      <div className="filter-bar">
        <button className={!category ? 'active' : ''} onClick={() => handleFilter('')}>All</button>
        {categories.map((c) => (
          <button key={c} className={category === c ? 'active' : ''} onClick={() => handleFilter(c)}>{c}</button>
        ))}
      </div>

      {loading && <p>Loading products...</p>}
      {error && <div className="message error">{error}</div>}
      {!loading && products.length === 0 && <p>No products available yet.</p>}

      <div className="product-grid">
        {products.map((p) => (
          <Link to={`/products/${p._id}`} key={p._id} className="product-card">
            <h3>{p.title}</h3>
            <p className="category">{p.category}</p>
            <p className="price">AUD ${p.price}</p>
            <p className="seller">by {p.seller?.name || 'Unknown seller'}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
