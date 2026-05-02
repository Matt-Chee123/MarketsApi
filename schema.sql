
CREATE TABLE funds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    vintage_year INTEGER NOT NULL,
    target_size_usd NUMERIC(20,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Fundraising', 'Investing', 'Closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
