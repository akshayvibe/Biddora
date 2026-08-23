const API_BASE = 'http://localhost:8080/api';

function getHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    return text; // Return plain text if not valid JSON
  }
}

// Auth
export function login(username, password) {
  return request(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ username, password }),
  });
}

export function register(data) {
  return request(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
}

// Products
export function getProducts(token, { page = 0, sortBy, name, productType } = {}) {
  const params = new URLSearchParams();
  params.set('page', page);
  if (sortBy) params.set('sortBy', sortBy);
  if (name) params.set('name', name);
  if (productType) params.set('productType', productType);
  return request(`${API_BASE}/products/all?${params}`, { headers: getHeaders(token) });
}

export function getProduct(id, token) {
  return request(`${API_BASE}/products/${id}`, { headers: getHeaders(token) });
}

export function getProductsByUser(userId, token) {
  return request(`${API_BASE}/products/user/${userId}`, { headers: getHeaders(token) });
}

export function createProduct(data, token) {
  return request(`${API_BASE}/products`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
}

export function editProduct(id, data, token) {
  return request(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id, token) {
  return request(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
}

// Bids
export function getBidsForProduct(productId, page = 0, token) {
  return request(`${API_BASE}/bid/product/${productId}?page=${page}`, {
    headers: getHeaders(token),
  });
}

export function placeBid(data, token) {
  return request(`${API_BASE}/bid`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
}

// Favorites
export function getFavorites(token) {
  return request(`${API_BASE}/favorites`, { headers: getHeaders(token) });
}

export function addFavorite(productId, token) {
  return request(`${API_BASE}/favorites`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ productId }),
  });
}

export function removeFavorite(productId, token) {
  return request(`${API_BASE}/favorites/${productId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
}

// Ratings
export function getProductRatings(productId, token) {
  return request(`${API_BASE}/ratings/product/${productId}`, { headers: getHeaders(token) });
}

export function createRating(data, token) {
  return request(`${API_BASE}/ratings`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });
}

// Users
export function getUser(id) {
  return request(`${API_BASE}/user/${id}`, { headers: getHeaders() });
}

// Auction winner
export function getAuctionWinner(productId, token) {
  return request(`${API_BASE}/auction-winner/product/${productId}`, {
    headers: getHeaders(token),
  });
}
