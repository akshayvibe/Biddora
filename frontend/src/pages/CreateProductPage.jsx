import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

export default function CreateProductPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    startingPrice: '',
    productType: 'ELECTRONICS',
    startTime: '',
    endTime: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = {
        ...form,
        startingPrice: Number(form.startingPrice),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString()
      };
      const res = await api.createProduct(data, token);
      navigate(`/product/${res.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <div className="page container mt-6 text-center">Please login to create an auction.</div>;
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="panel mt-6">
          <div className="panel-header">
            <span className="panel-header-title">
              <span className="panel-header-dot green"></span>
              Create New Auction
            </span>
          </div>
          <div className="panel-body-lg">
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} required />
              </div>
              <div className="grid grid-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Starting Price ($)</label>
                  <input className="form-input" type="number" name="startingPrice" min="1" value={form.startingPrice} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" name="productType" value={form.productType} onChange={handleChange}>
                    <option value="ELECTRONICS">Electronics</option>
                    <option value="FASHION">Fashion</option>
                    <option value="HOME">Home</option>
                    <option value="SPORTS">Sports</option>
                    <option value="TOYS">Toys</option>
                    <option value="ART">Art</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input className="form-input" type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input className="form-input" type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} required />
                </div>
              </div>
              <button className="btn btn-primary btn-block mt-4" disabled={loading} type="submit">
                {loading ? 'Creating...' : 'Create Auction'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
