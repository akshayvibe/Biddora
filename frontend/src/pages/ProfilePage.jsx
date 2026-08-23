import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import { StatusBadge, formatPrice, formatDateShort } from '../components/Shared';

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    loadData();
  }, [token]);

  async function loadData() {
    setLoading(true);
    try {
      const [prods, favs] = await Promise.all([
        api.getProductsByUser(user.id, token),
        api.getFavorites(token),
      ]);
      setProducts(prods);
      setFavorites(favs);
    } catch {}
    setLoading(false);
  }

  async function handleDeleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id, token);
      setProducts(products.filter(p => p.id !== id));
    } catch {}
  }

  async function handleRemoveFavorite(productId) {
    try {
      await api.removeFavorite(productId, token);
      setFavorites(favorites.filter(f => f.product?.id !== productId));
    } catch {}
  }

  if (!user) return null;

  return (
    <div className="page">
      <div className="container">
        {/* User info panel */}
        <div className="panel mt-4">
          <div className="panel-header">
            <span className="panel-header-title">
              <span className="panel-header-dot green"></span>
              User Profile
            </span>
          </div>
          <div className="panel-body-lg">
            <div className="flex gap-6" style={{ flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h2>{user.firstName} {user.lastName}</h2>
                <div className="mono text-sm text-muted mt-1">@{user.username}</div>
                <div className="text-sm text-muted mt-1">{user.email}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <span className="label">Role</span>
                  <div className="mono text-sm">{user.role}</div>
                </div>
                <div>
                  <span className="label">Member Since</span>
                  <div className="mono text-sm">{formatDateShort(user.registrationDate)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="tabs">
            <button className={`tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
              My Auctions ({products.length})
            </button>
            <button className={`tab ${tab === 'favorites' ? 'active' : ''}`} onClick={() => setTab('favorites')}>
              Favorites ({favorites.length})
            </button>
          </div>

          {loading ? (
            <div className="loading-center"><span className="spinner spinner-lg"></span></div>
          ) : tab === 'products' ? (
            products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">◇</div>
                <p>You haven't created any auctions yet</p>
                <Link to="/create" className="btn btn-sage btn-sm mt-3">Create one</Link>
              </div>
            ) : (
              <div className="grid grid-2">
                {products.map(p => (
                  <div className="card" key={p.id}>
                    <div className="card-body">
                      <div className="flex flex-between flex-center">
                        <StatusBadge status={p.productStatus} />
                        <div className="product-price">{formatPrice(p.startingPrice)}</div>
                      </div>
                      <h3 className="mt-2"><Link to={`/product/${p.id}`}>{p.name}</Link></h3>
                      <p className="text-sm text-muted truncate">{p.description || 'No description'}</p>
                    </div>
                    <div className="card-footer flex flex-between flex-center">
                      <span className="text-xs text-muted">{formatDateShort(p.createdAt)}</span>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            favorites.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">♡</div>
                <p>No favorites yet</p>
                <Link to="/" className="btn btn-sage btn-sm mt-3">Browse auctions</Link>
              </div>
            ) : (
              <div className="grid grid-2">
                {favorites.map(f => (
                  <div className="card" key={f.id}>
                    <div className="card-body">
                      <div className="flex flex-between flex-center">
                        <StatusBadge status={f.product?.productStatus} />
                        <div className="product-price">{formatPrice(f.product?.startingPrice)}</div>
                      </div>
                      <h3 className="mt-2"><Link to={`/product/${f.product?.id}`}>{f.product?.name}</Link></h3>
                    </div>
                    <div className="card-footer flex flex-between flex-center">
                      <span className="text-xs text-muted">By {f.product?.user?.username}</span>
                      <button className="btn btn-sm" onClick={() => handleRemoveFavorite(f.product?.id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
