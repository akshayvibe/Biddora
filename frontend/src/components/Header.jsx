import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="header">
      <div className="container-wide header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon"></span>
          BIDDORA
        </Link>
        <nav className="nav">
          <Link to="/">Auctions</Link>
          {user ? (
            <>
              <span className="text-sm text-muted mr-4" style={{ marginRight: '16px' }}>
                Hi, <strong>{user.firstName || user.username}</strong>
              </span>
              <Link to="/create">+ New</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
