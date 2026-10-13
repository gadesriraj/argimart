-- ==============================================================
-- HarvestHub – Smart Agriculture Marketplace
-- Demonstration & Sample Seed Data
-- ==============================================================

USE harvesthub_db;

-- BCrypt password hash for: 'Password@123'
-- Hash: $2a$12$e8e9sU3xW2fJ5N4.9kY6z.j4IeHh1sJ1eB8pY6j2W9fF4n2Z0xK1G

-- 1. Insert Initial Users
INSERT INTO users (id, full_name, email, phone, password_hash, role, address, active, created_at) VALUES
('user-admin-1', 'Harish Patel (Platform Administrator)', 'admin@harvesthub.com', '+91 98765 43210', '$2a$12$e8e9sU3xW2fJ5N4.9kY6z.j4IeHh1sJ1eB8pY6j2W9fF4n2Z0xK1G', 'ADMIN', 'AgriTech Central Hub, Sector 4, Hyderabad, India', TRUE, NOW()),
('user-farmer-1', 'Rameshwar Sharma (GreenField Farms)', 'ramesh@greenfield.com', '+91 98123 45678', '$2a$12$e8e9sU3xW2fJ5N4.9kY6z.j4IeHh1sJ1eB8pY6j2W9fF4n2Z0xK1G', 'FARMER', 'Plot 42, Kisan Nagar, Nashik, Maharashtra', TRUE, NOW()),
('user-farmer-2', 'Gurpreet Singh (Punjab Organic Growers)', 'gurpreet@punjaborganic.com', '+91 98456 78901', '$2a$12$e8e9sU3xW2fJ5N4.9kY6z.j4IeHh1sJ1eB8pY6j2W9fF4n2Z0xK1G', 'FARMER', 'Farm House 12, G.T. Road, Ludhiana, Punjab', TRUE, NOW()),
('user-customer-1', 'Priya Sundaram', 'priya@gmail.com', '+91 97654 32109', '$2a$12$e8e9sU3xW2fJ5N4.9kY6z.j4IeHh1sJ1eB8pY6j2W9fF4n2Z0xK1G', 'CUSTOMER', 'Flat 304, Palm Meadows, Whitefield, Bengaluru', TRUE, NOW())
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- 2. Insert Products
INSERT INTO products (id, name, description, category, price, unit, stock_quantity, image_url, location, farmer_id, farmer_name, active, rating, reviews_count) VALUES
('prod-1', 'Certified Sharbati Wheat Seeds (HD-2967)', 'High-yield disease-resistant certified wheat seed variety. Germination rate > 95%.', 'Seeds', 45.00, 'kg', 850, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80', 'Ludhiana, Punjab', 'user-farmer-2', 'Punjab Organic Growers', TRUE, 4.8, 34),
('prod-2', 'Basmati Paddy Seeds (Pusa 1121)', 'Authentic extra-long grain aromatic Basmati paddy seeds. Elongation ratio 2.5x.', 'Seeds', 85.00, 'kg', 620, 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=800&q=80', 'Karnal, Haryana', 'user-farmer-2', 'Punjab Organic Growers', TRUE, 4.9, 52),
('prod-3', 'Premium Vermicompost Organic Fertilizer', '100% pure organic earthworm castings enriched with beneficial soil microbes.', 'Fertilizers', 18.00, 'kg', 1500, 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80', 'Nashik, Maharashtra', 'user-farmer-1', 'GreenField Farms', TRUE, 4.7, 68),
('prod-4', 'Precision Drip Irrigation Kit (1 Acre Complete Set)', 'Complete commercial-grade drip irrigation kit with UV-treated lateral pipes.', 'Farm Equipment', 4800.00, 'kit', 35, 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80', 'Pune, Maharashtra', 'user-farmer-1', 'GreenField Farms', TRUE, 4.9, 29),
('prod-5', '16L Battery Operated Agricultural Sprayer', 'Dual-mode automatic & manual backpack sprayer with 12V rechargeable battery.', 'Farm Equipment', 2450.00, 'piece', 50, 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80', 'Nashik, Maharashtra', 'user-farmer-1', 'GreenField Farms', TRUE, 4.6, 19),
('prod-6', 'Vine-Ripened Fresh Red Tomatoes (Desi Variety)', 'Naturally ripened, pesticide-free fresh farm tomatoes harvested daily.', 'Vegetables', 32.00, 'kg', 400, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', 'Nashik, Maharashtra', 'user-farmer-1', 'GreenField Farms', TRUE, 4.9, 110),
('prod-7', 'Nashik Premium Red Onions (Export Grade)', 'Sun-cured medium to large red onions with dry outer skin. Long shelf life.', 'Vegetables', 28.00, 'kg', 1200, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80', 'Lasalgaon, Nashik', 'user-farmer-1', 'GreenField Farms', TRUE, 4.8, 84),
('prod-8', 'Organic Farm Assortment Vegetable Basket', 'Fresh seasonal combo basket including broccoli, spinach, carrots, and bell peppers.', 'Organic Products', 299.00, 'basket', 75, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', 'Pune, Maharashtra', 'user-farmer-1', 'GreenField Farms', TRUE, 5.0, 45),
('prod-9', 'Traditional Basmati White Rice (Aged 2 Years)', 'Aged traditional long-grain basmati rice. Non-sticky, delicate fragrance.', 'Grains', 110.00, 'kg', 950, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80', 'Ludhiana, Punjab', 'user-farmer-2', 'Punjab Organic Growers', TRUE, 4.9, 78),
('prod-10', 'Pure Cold-Pressed Neem Oil Bio-Pesticide (10000 PPM)', 'Natural eco-friendly insect repellent and fungicide for whitefly and mites control.', 'Pesticides', 360.00, 'liter', 180, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80', 'Nagpur, Maharashtra', 'user-farmer-1', 'GreenField Farms', TRUE, 4.7, 31)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. Insert Initial Orders
INSERT INTO orders (id, customer_id, customer_name, total_amount, order_status, payment_method, payment_status, delivery_address, contact_phone, created_at) VALUES
('ORD-7821', 'user-customer-1', 'Priya Sundaram', 1475.00, 'DELIVERED', 'CASH_ON_DELIVERY', 'PAID', 'Flat 304, Palm Meadows, Whitefield, Bengaluru', '+91 97654 32109', '2026-03-01 10:15:00'),
('ORD-9042', 'user-customer-1', 'Priya Sundaram', 2540.00, 'SHIPPED', 'SIMULATED_UPI', 'PAID', 'Flat 304, Palm Meadows, Whitefield, Bengaluru', '+91 97654 32109', '2026-03-08 14:20:00')
ON DUPLICATE KEY UPDATE customer_name=VALUES(customer_name);

-- 4. Insert Order Items
INSERT INTO order_items (id, order_id, product_id, product_name_snapshot, unit_price, quantity, subtotal, farmer_id, farmer_name, image_url) VALUES
('ord-item-1', 'ORD-7821', 'prod-8', 'Organic Farm Assortment Vegetable Basket', 299.00, 2, 598.00, 'user-farmer-1', 'GreenField Farms', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'),
('ord-item-2', 'ORD-9042', 'prod-5', '16L Battery Operated Agricultural Sprayer', 2450.00, 1, 2450.00, 'user-farmer-1', 'GreenField Farms', 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80')
ON DUPLICATE KEY UPDATE product_name_snapshot=VALUES(product_name_snapshot);

-- 5. Insert Feedback
INSERT INTO feedbacks (id, customer_id, customer_name, product_id, rating, comment, created_at) VALUES
('fb-1', 'user-customer-1', 'Priya Sundaram', 'prod-1', 5, 'Exceptional seed quality! Germination rate was over 96% in our trial plot.', NOW()),
('fb-2', 'user-customer-1', 'Priya Sundaram', 'prod-6', 5, 'Farm-fresh tomatoes arrived perfectly ripe and completely undamaged.', NOW())
ON DUPLICATE KEY UPDATE comment=VALUES(comment);
