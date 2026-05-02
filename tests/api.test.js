const request = require('supertest');
const { app } = require('../src/app');
const { pool } = require('../src/db');

beforeEach(async () => {
    await pool.query('TRUNCATE investments, investors, funds CASCADE');
});

afterAll(async () => {
    await pool.end();
});

describe('Funds', () => {
    test('POST /funds creates a fund and returns 201', async () => {
        const res = await request(app).post('/funds').send({
            name: 'Test Fund',
            vintage_year: 2025,
            target_size_usd: 100000000,
            status: 'Fundraising',
        });
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Test Fund');
        expect(res.body.id).toBeDefined();
    });

    test('POST /funds with invalid status returns 400', async () => {
        const res = await request(app).post('/funds').send({
            name: 'Test Fund',
            vintage_year: 2025,
            target_size_usd: 100000000,
            status: 'NotARealStatus',
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('validation_failed');
    });

    test('GET /funds/:id returns 404 for non-existent fund', async () => {
        const res = await request(app).get('/funds/11111111-1111-4111-8111-111111111111');
        expect(res.status).toBe(404);
    });

    test('PUT /funds returns 404 when updating a non-existent fund', async () => {
        const res = await request(app).put('/funds').send({
            id: '11111111-1111-4111-8111-111111111111',
            name: 'Ghost Fund',
            vintage_year: 2025,
            target_size_usd: 100000000,
            status: 'Fundraising',
        });
        expect(res.status).toBe(404);
    });
});

describe('Investors', () => {
    test('POST /investors rejects duplicate email with 409', async () => {
        const payload = {
            name: 'Duplicate Co',
            investor_type: 'Institution',
            email: 'dup@example.com',
        };
        await request(app).post('/investors').send(payload);
        const res = await request(app).post('/investors').send(payload);
        expect(res.status).toBe(409);
    });
});

describe('Investments', () => {
    test('POST creates an investment with 201 when fund and investor exist', async () => {
        const fundRes = await request(app).post('/funds').send({
            name: 'Parent Fund',
            vintage_year: 2025,
            target_size_usd: 100000000,
            status: 'Fundraising',
        });
        const investorRes = await request(app).post('/investors').send({
            name: 'Test Investor',
            investor_type: 'Individual',
            email: 'investor@example.com',
        });

        const res = await request(app)
            .post(`/funds/${fundRes.body.id}/investments`)
            .send({
                investor_id: investorRes.body.id,
                amount_usd: 5000000,
                investment_date: '2026-01-15',
            });

        console.log('Status:', res.status);
        console.log('Body:', JSON.stringify(res.body, null, 2));

        expect(res.status).toBe(201);
        expect(res.body.fund_id).toBe(fundRes.body.id);
        expect(res.body.investor_id).toBe(investorRes.body.id);
        expect(res.body.id).toBeDefined();
    });

    test('POST returns 404 when the parent fund does not exist', async () => {
        const investorRes = await request(app).post('/investors').send({
            name: 'Test Investor',
            investor_type: 'Individual',
            email: 'investor@example.com',
        });
        const res = await request(app)
            .post('/funds/11111111-1111-4111-8111-111111111111/investments')
            .send({
                investor_id: investorRes.body.id,
                amount_usd: 1000000,
                investment_date: '2026-01-01',
            });
        expect(res.status).toBe(404);
    });
});