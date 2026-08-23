const API_BASE = 'http://localhost:8080/api';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }
  const body = await res.text();
  return body ? JSON.parse(body) : null;
}

async function seed() {
  console.log('Seeding demo data...');
  
  try {
    // 1. Register users
    console.log('Creating users...');
    try {
      await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: 'retro_seller',
          firstName: 'Retro',
          lastName: 'Seller',
          password: 'password123',
          email: 'seller@example.com'
        })
      });
    } catch (e) { console.log('User retro_seller might exist.'); }

    try {
      await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: 'vintage_buyer',
          firstName: 'Vintage',
          lastName: 'Buyer',
          password: 'password123',
          email: 'buyer@example.com'
        })
      });
    } catch (e) { console.log('User vintage_buyer might exist.'); }

    // 2. Login
    console.log('Logging in...');
    const sellerAuth = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'retro_seller', password: 'password123' })
    });
    const sellerToken = sellerAuth.token;

    const buyerAuth = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'vintage_buyer', password: 'password123' })
    });
    const buyerToken = buyerAuth.token;

    // 3. Create Products (as seller)
    console.log('Creating products...');
    const now = new Date();
    
    // Format date for API: yyyy-MM-dd'T'HH:mm:ss in local time
    const format = d => {
      const pad = n => n.toString().padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    
    // Open product (starts in 10 seconds, ends tomorrow)
    const d1Start = new Date(now.getTime() + 10000); // 10 seconds from now
    const d1End = new Date(now); d1End.setDate(d1End.getDate() + 1);
    
    const prod1 = await request('/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${sellerToken}` },
      body: JSON.stringify({
        name: 'IBM Model M Keyboard (1989)',
        startingPrice: 150,
        startTime: format(d1Start),
        endTime: format(d1End),
        description: 'Legendary mechanical keyboard with buckling springs. Excellent condition.'
      })
    });

    // Scheduled product (starts tomorrow, ends in 3 days)
    const d2Start = new Date(now); d2Start.setDate(d2Start.getDate() + 1);
    const d2End = new Date(now); d2End.setDate(d2End.getDate() + 3);
    
    await request('/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${sellerToken}` },
      body: JSON.stringify({
        name: 'Sony Walkman TPS-L2',
        startingPrice: 300,
        startTime: format(d2Start),
        endTime: format(d2End),
        description: 'Original first-generation Walkman from 1979. Working perfectly.'
      })
    });

    console.log('Waiting 12 seconds for backend scheduler to open the first auction...');
    await new Promise(r => setTimeout(r, 12000));

    // 4. Place Bids (as buyer)
    console.log('Placing bids...');
    await request('/bid', {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: JSON.stringify({
        productId: prod1.id,
        amount: 160
      })
    });

    await request('/bid', {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: JSON.stringify({
        productId: prod1.id,
        amount: 175
      })
    });

    console.log('✅ Demo data seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Seller: retro_seller / password123');
    console.log('Buyer: vintage_buyer / password123');
  } catch (err) {
    console.error('Failed to seed:', err.message);
  }
}

seed();
