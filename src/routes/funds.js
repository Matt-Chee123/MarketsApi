const express = require('express');
const { pool } = require('../db');
const { NotFoundError } = require('../errors');
const {
    FundCreateSchema,
    FundUpdateSchema,
    UuidSchema,
} = require('../validation/schemas');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM funds ORDER BY created_at DESC`,
        )
        res.json(rows);
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const data = FundCreateSchema.parse(req.body);
        const { rows } = await pool.query(
            `INSERT INTO funds (name, vintage_year, target_size_usd, status) 
                VALUES ($1, $2, $3, $4) RETURNING *`,
            [data.name, data.vintage_year, data.target_size_usd, data.status],
        )
        res.status(201).json(rows[0])
    } catch (error) {
        next(error)
    }
})

router.put('/', async (req, res, next) => {
    try {
        const data = FundUpdateSchema.parse(req.body);
        const { rows } = await pool.query(
            `UPDATE funds
             SET name = $1, vintage_year = $2, target_size_usd = $3, status = $4
             WHERE id = $5
                 RETURNING *`,
            [data.name, data.vintage_year, data.target_size_usd, data.status, data.id],
        )
        if (rows.length === 0) {
            throw new NotFoundError('Fund');
        }
        res.json(rows[0])
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const id = UuidSchema.parse(req.params.id);
        const { rows } = await pool.query(
            `SELECT * FROM funds WHERE id = $1`,
            [id]
        )
        if (rows.length === 0) {
            throw new NotFoundError('Fund');
        }
        res.json(rows[0]);
    } catch (error) {
        next(error)
    }
})

module.exports = router;