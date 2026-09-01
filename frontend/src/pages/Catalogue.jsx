import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles/Catalogue.css';

export default function Catalogue() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get('/products')
      .then((res) => setProducts(res.data.products))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = !category || product.category === category;
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  return (
    <div className="catalogue-page">
      <section className="catalogue-search-section">
        <div className="catalogue-inner">

          <div className="catalogue-title-row">
            <i className="ri-folder-upload-fill"></i>
            <h1>Search PlanForge Library</h1>
          </div>

          <p className="catalogue-question">
            What are you looking for?
          </p>

          <div className="catalogue-search-box">
            <i className="ri-search-line"></i>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
            />
          </div>

          <div className="catalogue-filter-bar">
            <button
              className={!category ? 'active' : ''}
              onClick={() => setCategory('')}
            >
              All resources
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                className={category === cat ? 'active' : ''}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      <section className="catalogue-products-section">
        <div className="catalogue-inner">
          {loading && <p className="catalogue-status">Loading products...</p>}
          {error && <p className="catalogue-status catalogue-error">{error}</p>}
          {!loading && !error && filteredProducts.length === 0 && (
            <p className="catalogue-status">No products found.</p>
          )}

          <div className="catalogue-product-grid">
            {filteredProducts.map((product) => (
              <article key={product._id} className="catalogue-product-card">

                <Link
                  to={`/products/${product._id}`}
                  className="catalogue-product-image-link"
                >
                  <div className="catalogue-product-image catalogue-product-image-placeholder">
                    <i className="ri-file-text-line"></i>
                  </div>
                </Link>

                <div className="catalogue-product-body">
                  <h3>{product.title}</h3>

                  <p className="catalogue-product-description">
                    {product.description}
                  </p>

                  <Link
                    to={`/products/${product._id}`}
                    className="catalogue-view-link"
                  >
                    View Template
                  </Link>

                  <div className="catalogue-card-footer">
                    <span className="catalogue-file-badge">
                      {product.fileFormat}
                    </span>
                    <span className="catalogue-price">
                      AUD ${product.price}
                    </span>
                  </div>
                </div>

              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
