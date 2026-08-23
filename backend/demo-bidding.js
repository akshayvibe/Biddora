const API_BASE = 'http://localhost:8080/api';

async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  return data.token;
}

async function placeBid(token, productId, amount) {
  const res = await fetch(`${API_BASE}/bid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId, amount })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to place bid: ${text}`);
  }
  return res.json();
}

async function getProduct(productId) {
  const res = await fetch(`${API_BASE}/products/${productId}`);
  return res.json();
}

async function getHighestBid(productId, token) {
  const res = await fetch(`${API_BASE}/bid/product/${productId}?page=0`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error(`Failed to get bids: ${res.status}`);
  }
  const data = await res.json();
  if (data.content && data.content.length > 0) {
    return data.content[0].amount;
  }
  return 0;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runDemo() {
  console.log('Logging in bidders...');
  const t1 = await login('bidder_1', 'password123');
  const t2 = await login('bidder_2', 'password123');
  const t3 = await login('bidder_3', 'password123');
  const tokens = [t1, t2, t3];
  const usernames = ['bidder_1', 'bidder_2', 'bidder_3'];

  const productId = 5; // Nintendo Entertainment System
  
  console.log(`Starting live bidding demo on Product ${productId}...`);
  
  for (let i = 0; i < 40; i++) {
    const bidderIdx = i % 3;
    const token = tokens[bidderIdx];
    const username = usernames[bidderIdx];
    
    let currentHigh = await getHighestBid(productId, token);
    if (currentHigh === 0) {
      const prod = await getProduct(productId);
      currentHigh = prod.startingPrice;
    }
    
    // Add random amount between 1 and 10 to current highest
    const nextBid = currentHigh + Math.floor(Math.random() * 10) + 1;
    
    console.log(`[${new Date().toLocaleTimeString()}] ${username} is placing a bid for $${nextBid}...`);
    try {
      await placeBid(token, productId, nextBid);
      console.log(`✅ Success! ${username} placed bid for $${nextBid}`);
    } catch (e) {
      console.error(`❌ Error: ${e.message}`);
    }
    
    // Wait a few seconds before next bid
    const waitTime = Math.floor(Math.random() * 3000) + 2000;
    await sleep(waitTime);
  }
  console.log('Demo finished.');
}

runDemo();
