import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import { StatusBadge, formatPrice, formatDate, formatDateShort, TimeRemaining } from '../components/Shared';

export default function ProductPage() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [winner, setWinner] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [ratingComment, setRatingComment] = useState('');
  const [ratingStars, setRatingStars] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('bids');
  const [isFavorite, setIsFavorite] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    loadProduct();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [id]);

  async function loadProduct() {
    setLoading(true);
    try {
      const [prod, bidRes, ratingRes] = await Promise.all([
        api.getProduct(id, token),
        api.getBidsForProduct(id, 0, token),
        api.getProductRatings(id, token),
      ]);
      setProduct(prod);
      setBids(bidRes);
      setRatings(ratingRes);

      // Check if user has favorited
      if (token) {
        try {
          const favs = await api.getFavorites(token);
          setIsFavorite(favs.some(f => f.product?.id === prod.id));
        } catch {}
      }

      // Try to get winner if closed
      if (prod.productStatus === 'CLOSED') {
        try {
          const w = await api.getAuctionWinner(id, token);
          setWinner(w);
        } catch {}
      }

      // Connect WebSocket for live bids
      connectWS(prod.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function connectWS(productId) {
    try {
      const ws = new WebSocket('ws://localhost:8080/ws');
      ws.onopen = () => {
        ws.send(JSON.stringify({ productId }));
      };
      ws.onmessage = (event) => {
        const bid = JSON.parse(event.data);
        setBids(prev => {
          if (!prev) return prev;
          const newContent = [bid, ...prev.content.filter(b => b.id !== bid.id)];
          return { ...prev, content: newContent };
        });
      };
      wsRef.current = ws;
    } catch {}
  }

  async function handlePlaceBid(e) {
    e.preventDefault();
    setBidError('');
    setBidSuccess('');
    try {
      await api.placeBid({ productId: Number(id), amount: Number(bidAmount) }, token);
      setBidSuccess('Bid placed successfully!');
      setBidAmount('');
      // Reload bids
      const bidRes = await api.getBidsForProduct(id, 0, token);
      setBids(bidRes);
    } catch (err) {
      setBidError(err.message);
    }
  }

  async function toggleFavorite() {
    try {
      if (isFavorite) {
        await api.removeFavorite(product.id, token);
        setIsFavorite(false);
      } else {
        await api.addFavorite(product.id, token);
        setIsFavorite(true);
      }
    } catch {}
  }

  async function handleSubmitRating(e) {
    e.preventDefault();
    try {
      await api.createRating({ productId: Number(id), comment: ratingComment, ratingStars }, token);
      setRatingComment('');
      setRatingStars(5);
      const ratingRes = await api.getProductRatings(id);
      setRatings(ratingRes);
    } catch {}
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading-center"><span className="spinner spinner-lg"></span> Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page">
        <div className="container"><div className="error-msg">{error || 'Product not found'}</div></div>
      </div>
    );
  }

  const highestBid = bids?.content?.[0]?.amount || product.startingPrice;

  return (
    <div className="page">
      <div className="container">
        <Link to="/" className="text-sm text-muted" style={{ display: 'inline-block', marginBottom: 16 }}>← Back to auctions</Link>

        <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Main column */}
          <div>
            <div className="panel">
              <div className="panel-header">
                <span className="panel-header-title">
                  <span className="panel-header-dot green"></span>
                  Product Details
                </span>
                <StatusBadge status={product.productStatus} />
              </div>
              <div className="panel-body-lg">
                <h1>{product.name}</h1>
                <p className="text-muted mt-2" style={{ lineHeight: 1.7 }}>{product.description || 'No description provided.'}</p>
                <div className="flex gap-6 mt-4" style={{ flexWrap: 'wrap' }}>
                  <div>
                    <span className="label">Starting Price</span>
                    <div className="product-price">{formatPrice(product.startingPrice)}</div>
                  </div>
                  <div>
                    <span className="label">Current High</span>
                    <div className="product-price">{formatPrice(highestBid)}</div>
                  </div>
                  <div>
                    <span className="label">Time Left</span>
                    <div><TimeRemaining endTime={product.endTime} /></div>
                  </div>
                </div>
                <div className="flex gap-6 mt-4" style={{ flexWrap: 'wrap' }}>
                  <div><span className="label">Start</span><div className="mono text-sm">{formatDateShort(product.startTime)}</div></div>
                  <div><span className="label">End</span><div className="mono text-sm">{formatDateShort(product.endTime)}</div></div>
                  <div><span className="label">Seller</span><div className="text-sm">{product.user?.username}</div></div>
                </div>

                {token && (
                  <div className="mt-4">
                    <button className="btn btn-sm" onClick={toggleFavorite}>
                      {isFavorite ? '♥ Favorited' : '♡ Add to favorites'}
                    </button>
                  </div>
                )}

                {/* Winner */}
                {winner && (
                  <div className="success-msg mt-4">
                    🏆 Winner: <strong>{winner.user?.username}</strong> — {formatPrice(winner.amount)}
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-4">
              <div className="tabs">
                <button className={`tab ${tab === 'bids' ? 'active' : ''}`} onClick={() => setTab('bids')}>
                  Bids ({bids?.content?.length || 0})
                </button>
                <button className={`tab ${tab === 'ratings' ? 'active' : ''}`} onClick={() => setTab('ratings')}>
                  Reviews ({ratings.length})
                </button>
              </div>

              {tab === 'bids' && (
                <div className="panel">
                  <div className="panel-body" style={{ padding: 0 }}>
                    {(!bids?.content || bids.content.length === 0) ? (
                      <div className="empty-state" style={{ padding: '32px 16px' }}>
                        <p className="text-muted">No bids yet. Be the first!</p>
                      </div>
                    ) : (
                      bids.content.map((bid, i) => (
                        <div className="bid-item" key={bid.id || i}>
                          <div>
                            <span className="bid-amount">{formatPrice(bid.amount)}</span>
                            <span className="bid-user" style={{ marginLeft: 8 }}>by {bid.bidderUsername}</span>
                          </div>
                          <span className="bid-time">{formatDateShort(bid.timestamp)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {tab === 'ratings' && (
                <div className="panel">
                  <div className="panel-body">
                    {ratings.length === 0 ? (
                      <div className="empty-state" style={{ padding: '24px 0' }}>
                        <p className="text-muted">No reviews yet</p>
                      </div>
                    ) : (
                      ratings.map((r, i) => (
                        <div key={r.id || i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--gray-lighter)' }}>
                          <div className="flex flex-between flex-center">
                            <span className="text-sm"><strong>{r.user?.username}</strong></span>
                            <span className="stars">
                              {[1,2,3,4,5].map(s => (
                                <span key={s} className={`star ${s <= r.ratingStars ? 'filled' : ''}`}>★</span>
                              ))}
                            </span>
                          </div>
                          <p className="text-sm text-muted mt-1">{r.comment || '(no comment)'}</p>
                          <span className="text-xs text-muted">{formatDateShort(r.ratingDate)}</span>
                        </div>
                      ))
                    )}

                    {/* Add review form */}
                    {token && (
                      <form onSubmit={handleSubmitRating} className="mt-4" style={{ borderTop: '1px solid var(--gray-lighter)', paddingTop: 16 }}>
                        <div className="label mb-2">Leave a review</div>
                        <div className="flex gap-2 mb-2">
                          <span className="label" style={{ marginRight: 4 }}>Stars:</span>
                          <div className="stars">
                            {[1,2,3,4,5].map(s => (
                              <span key={s} className={`star ${s <= ratingStars ? 'filled' : ''}`} onClick={() => setRatingStars(s)}>★</span>
                            ))}
                          </div>
                        </div>
                        <textarea className="form-textarea" placeholder="Comment..." value={ratingComment} onChange={e => setRatingComment(e.target.value)} style={{ minHeight: 50 }} />
                        <button className="btn btn-sm btn-sage mt-2" type="submit">Submit Review</button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar — Bid form */}
          <div>
            <div className="panel" style={{ position: 'sticky', top: 70 }}>
              <div className="panel-header">
                <span className="panel-header-title">
                  <span className="panel-header-dot yellow"></span>
                  Place Bid
                </span>
              </div>
              <div className="panel-body-lg">
                {product.productStatus !== 'OPEN' ? (
                  <div className="text-sm text-muted text-center">
                    {product.productStatus === 'SCHEDULED' ? 'Auction has not started yet' : 'Auction has ended'}
                  </div>
                ) : !token ? (
                  <div className="text-sm text-center">
                    <Link to="/login">Sign in</Link> to place a bid
                  </div>
                ) : user?.id === product.user?.id ? (
                  <div className="text-sm text-muted text-center">
                    You cannot bid on your own auction.
                  </div>
                ) : (
                  <form onSubmit={handlePlaceBid}>
                    {bidError && <div className="error-msg">{bidError}</div>}
                    {bidSuccess && <div className="success-msg">{bidSuccess}</div>}
                    <div className="form-group">
                      <label className="form-label">Bid Amount ($)</label>
                      <input
                        className="form-input"
                        type="number"
                        min={highestBid + 1}
                        value={bidAmount}
                        onChange={e => setBidAmount(e.target.value)}
                        placeholder={`Min: $${highestBid + 1}`}
                        required
                      />
                    </div>
                    <button className="btn btn-teal btn-block" type="submit">
                      Place Bid
                    </button>
                    <div className="text-xs text-muted text-center mt-2">
                      Current highest: {formatPrice(highestBid)}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
