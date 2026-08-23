import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('biddora_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem('biddora_auth');
      }
    }
    setLoading(false);
  }, []);

  function loginUser(authResponse) {
    setUser(authResponse.user);
    setToken(authResponse.token);
    localStorage.setItem('biddora_auth', JSON.stringify(authResponse));
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('biddora_auth');
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
