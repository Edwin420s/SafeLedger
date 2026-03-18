-- Seed users (passwords are hashed versions of 'password123' – replace with actual hashes in production)
INSERT INTO users (id, phone, password, name, trust_score) VALUES
    (gen_random_uuid(), '254700000001', '$2a$10$X7VYx8Fn4p3y8qL9wM1n2e3R4t5Y6u7i8o9p0q1r2s3t4u5v6w7x8y9z0a', 'John Doe', 4.5),
    (gen_random_uuid(), '254700000002', '$2a$10$X7VYx8Fn4p3y8qL9wM1n2e3R4t5Y6u7i8o9p0q1r2s3t4u5v6w7x8y9z0a', 'Jane Smith', 3.8),
    (gen_random_uuid(), '254700000003', '$2a$10$X7VYx8Fn4p3y8qL9wM1n2e3R4t5Y6u7i8o9p0q1r2s3t4u5v6w7x8y9z0a', 'Alice Wanjiku', 5.0);

-- Seed agreements
INSERT INTO agreements (id, lender_id, borrower_id, amount, due_date, status, hash) VALUES
    (gen_random_uuid(), (SELECT id FROM users WHERE phone='254700000001'), (SELECT id FROM users WHERE phone='254700000002'), 5000.00, NOW() + INTERVAL '30 days', 'ACTIVE', 'abc123def456...'),
    (gen_random_uuid(), (SELECT id FROM users WHERE phone='254700000002'), (SELECT id FROM users WHERE phone='254700000003'), 2000.00, NOW() + INTERVAL '15 days', 'PENDING', 'def789abc012...');

-- Seed payments
INSERT INTO payments (id, agreement_id, amount, notes) VALUES
    (gen_random_uuid(), (SELECT id FROM agreements WHERE amount=5000.00), 1000.00, 'First installment'),
    (gen_random_uuid(), (SELECT id FROM agreements WHERE amount=5000.00), 1500.00, 'Second installment');
