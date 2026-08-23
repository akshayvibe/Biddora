-- Clear old data
TRUNCATE TABLE bids, ratings, favorites, auction_winners, products, users RESTART IDENTITY CASCADE;

-- Insert users
INSERT INTO users (id, username, first_name, last_name, password, email, registration_date, role) VALUES 
(1, 'retro_seller', 'Retro', 'Seller', '$2a$10$wYMxJ97P63L317lM5JbNveG.uG7cW5642R40r.Gk.W2W9eU7iR8iC', 'seller@example.com', CURRENT_TIMESTAMP, 1),
(2, 'vintage_buyer', 'Vintage', 'Buyer', '$2a$10$wYMxJ97P63L317lM5JbNveG.uG7cW5642R40r.Gk.W2W9eU7iR8iC', 'buyer@example.com', CURRENT_TIMESTAMP, 1);
-- (Password is 'password123' hashed with bcrypt)

-- Insert products
INSERT INTO products (id, name, starting_price, start_time, end_time, description, product_status, user_id, created_at) VALUES 
(1, 'IBM Model M Keyboard', 150, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '1 day', 'Legendary mechanical keyboard.', 'OPEN', 1, CURRENT_TIMESTAMP),
(2, 'Sony Walkman TPS-L2', 300, CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '3 days', 'Original first-gen Walkman.', 'SCHEDULED', 1, CURRENT_TIMESTAMP),
(3, 'Apple Macintosh Classic', 450, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Vintage Mac from 1990.', 'CLOSED', 1, CURRENT_TIMESTAMP);

-- Insert bids (for the open product)
INSERT INTO bids (id, amount, product_id, bidder_id, timestamp) VALUES 
(1, 160, 1, 2, CURRENT_TIMESTAMP - INTERVAL '5 hours'),
(2, 175, 1, 2, CURRENT_TIMESTAMP - INTERVAL '1 hour');

-- Insert auction winner (for the closed product)
INSERT INTO auction_winners (id, amount, product_id, user_id) VALUES 
(1, 600, 3, 2);

-- Insert ratings
INSERT INTO ratings (id, comment, rating_stars, product_id, user_id, rating_date) VALUES 
(1, 'Great seller!', 5, 3, 2, CURRENT_TIMESTAMP);

-- Insert favorites
INSERT INTO favorites (id, product_id, user_id) VALUES 
(1, 1, 2),
(2, 2, 2);
