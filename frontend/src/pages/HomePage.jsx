import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import { StatusBadge, formatPrice, TimeRemaining } from '../components/Shared';

export default function HomePage() {
  const { token } = useAuth();
  const [products, setProducts] = useState(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, [page, filter, sort]);

  async function loadProducts() {
    setLoading(true);
    setError('');
    try {
      const res = await api.getProducts(token, {
        page,
        sortBy: sort || undefined,
        name: search || undefined,
        productType: filter || undefined,
      });
      setProducts(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(0);
    loadProducts();
  }

  return (
    <div className="page">
      <div className="container-wide">
        {/* Title */}
        <div className="flex flex-between flex-center mb-4" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1>Auctions</h1>
            <span className="label">Browse live and upcoming auctions</span>
          </div>
        </div>

        {/* Filters bar */}
        <div className="panel mb-4">
          <div className="panel-body" style={{ padding: '8px 16px' }}>
            <form onSubmit={handleSearch} className="flex flex-center gap-3" style={{ flexWrap: 'wrap' }}>
              <input
                className="form-input"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ maxWidth: 220 }}
              />
              <select className="form-select" value={filter} onChange={e => { setFilter(e.target.value); setPage(0); }} style={{ maxWidth: 140 }}>
                <option value="">All status</option>
                <option value="OPEN">Open</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="CLOSED">Closed</option>
              </select>
              <select className="form-select" value={sort} onChange={e => { setSort(e.target.value); setPage(0); }} style={{ maxWidth: 150 }}>
                <option value="">Sort: Name</option>
                <option value="price-high">Price: High → Low</option>
                <option value="price-low">Price: Low → High</option>
              </select>
              <button className="btn btn-sm" type="submit">Search</button>
            </form>
          </div>
        </div>

        {/* Error */}
        {error && <div className="error-msg">{error}</div>}

        {/* Loading */}
        {loading && (
          <div className="loading-center">
            <span className="spinner spinner-lg"></span>
            Loading auctions...
          </div>
        )}

        {/* Products grid */}
        {!loading && products && products.content?.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">◇</div>
            <p>No auctions found</p>
            <p className="text-sm text-muted mt-2">Try adjusting your filters</p>
          </div>
        )}

        {!loading && products && products.content?.length > 0 && (
          <>
            <div className="grid grid-3">
              {products.content.map(product => (
                <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card product-card">
                    <div className="card-body">
                      <div className="flex flex-between flex-center">
                        <StatusBadge status={product.productStatus} />
                        <TimeRemaining endTime={product.endTime} />
                      </div>
                      <h3 className="truncate" style={{ marginTop: 8 }}>{product.name}</h3>
                      <p className="text-sm text-muted truncate">{product.description || 'No description'}</p>
                      <div className="product-price">{formatPrice(product.startingPrice)}</div>
                    </div>
                    <div className="card-footer">
                      <span className="label">By {product.user?.username || 'Unknown'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {products.totalPages > 1 && (
              <div className="pagination">
                <button className="btn btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                  ← Prev
                </button>
                <span className="page-info">
                  {page + 1} / {products.totalPages}
                </span>
                <button className="btn btn-sm" disabled={page >= products.totalPages - 1} onClick={() => setPage(p => p + 1)}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
