import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', firstName: '', lastName: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await api.register(form);
        // After register, auto-login
        const res = await api.login(form.username, form.password);
        loginUser(res);
      } else {
        const res = await api.login(form.username, form.password);
        loginUser(res);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 400 }}>
        <div className="panel mt-6">
          <div className="panel-header">
            <span className="panel-header-title">
              <span className="panel-header-dot green"></span>
              {isRegister ? 'Create Account' : 'Sign In'}
            </span>
          </div>
          <div className="panel-body-lg">
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  className="form-input"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  minLength={5}
                  maxLength={15}
                />
              </div>
              {isRegister && (
                <>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-input" name="firstName" value={form.firstName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-input" name="lastName" value={form.lastName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} required />
                  </div>
                </>
              )}
              <div className="form-group relative">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-input"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    minLength={5}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: 'var(--charcoal)',
                      padding: '4px'
                    }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
              </div>
              <button className="btn btn-primary btn-block" disabled={loading} type="submit">
                {loading ? <span className="spinner"></span> : (isRegister ? 'Register' : 'Login')}
              </button>
            </form>
            <div className="mt-4 text-center text-sm">
              {isRegister ? (
                <span>Already have an account? <button className="btn btn-sm" onClick={() => { setIsRegister(false); setError(''); }}>Sign In</button></span>
              ) : (
                <span>New here? <button className="btn btn-sm" onClick={() => { setIsRegister(true); setError(''); }}>Register</button></span>
              )}
            </div>

            <div className="mt-6" style={{ 
              border: '2px dashed var(--charcoal)', 
              padding: '16px',
              backgroundColor: 'var(--sage-light)',
              borderRadius: '0px'
            }}>
              <div className="text-center text-sm mb-3 font-mono" style={{ fontWeight: 'bold' }}>⚡️ QUICK DEMO LOGINS</div>
              <div className="grid grid-2 gap-3">
                <button 
                  className="btn btn-sm btn-teal" 
                  onClick={() => {
                    api.login('retro_seller', 'password123').then(res => { loginUser(res); navigate('/'); }).catch(err => setError(err.message));
                  }}
                >
                  Demo Seller
                </button>
                <button 
                  className="btn btn-sm btn-coral"
                  onClick={() => {
                    api.login('vintage_buyer', 'password123').then(res => { loginUser(res); navigate('/'); }).catch(err => setError(err.message));
                  }}
                >
                  Demo Buyer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
