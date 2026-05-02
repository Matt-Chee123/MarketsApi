INSERT INTO funds (id, name, vintage_year, target_size_usd, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Titanbay Growth Fund I', 2024, 250000000.00, 'Investing'),
    ('660e8400-e29b-41d4-a716-446655440001', 'Titanbay Growth Fund II', 2025, 500000000.00, 'Fundraising'),
    ('661e8400-e29b-41d4-a716-446655440010', 'Titanbay Buyout Fund III', 2023, 750000000.00, 'Closed');

INSERT INTO investors (id, name, investor_type, email) VALUES
    ('770e8400-e29b-41d4-a716-446655440002', 'John Doe Asset Management', 'Institution', 'investments@jdam.com'),
    ('880e8400-e29b-41d4-a716-446655440003', 'PE Inc', 'Institution', 'privateequity@inc.gov.uk'),
    ('881e8400-e29b-41d4-a716-446655440011', 'Brown Family Office', 'Family Office', 'investments@brown.com'),
    ('882e8400-e29b-41d4-a716-446655440012', 'Jane Smith', 'Individual', 'jane.smith@example.com');

INSERT INTO investments (investor_id, fund_id, amount_usd, investment_date) VALUES
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 50000000.00, '2024-03-15'),
    ('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 75000000.00, '2024-04-20'),
    ('881e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440001', 25000000.00, '2025-01-10'),
    ('882e8400-e29b-41d4-a716-446655440012', '661e8400-e29b-41d4-a716-446655440010', 5000000.00, '2023-06-01');