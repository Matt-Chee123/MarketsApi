const express = require('express');
const { pool } = require('../db');
const { NotFoundError } = require('../errors');
const {
    InvestmentCreateSchema,
    UuidSchema,
} = require('../validation/schemas');

const router = express.Router({ mergeParams: true });

async function ensureFundExists(fundId) {
    const {rows} = await pool.query('SELECT 1 FROM funds WHERE id = $1', [fundId]);
    if (rows.length === 0) {
        throw new NotFoundError('Fund');
    }
}

router.get('/', async (req, res, next) => {
    try {
        const fundId = UuidSchema.parse(req.params.fund_id);
        await ensureFundExists(fundId);
        const { rows } = await pool.query(
            'SELECT * FROM investments WHERE fund_id = $1 ORDER BY investment_date DESC'
            , [fundId]);
        res.json(rows);
    } catch (error) {
        next(error);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const fundId = UuidSchema.parse(req.params.fund_id);
        await ensureFundExists(fundId);
        const data = InvestmentCreateSchema.parse(req.body);
        const { rows } = await pool.query(
            `INSERT INTO investments (fund_id, investor_id, amount_usd, investment_date) 
                VALUES ($1, $2, $3, $4)
            RETURNING *`
            , [fundId, data.investor_id, data.amount_usd, data.investment_date]);
        res.status(201).json(rows[0])
    } catch (error) {
        next(error);
    }
})

module.exports = router;