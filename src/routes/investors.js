const express = require('express');
const { pool } = require('../db');
const { NotFoundError } = require('../errors');
const {
    InvestorCreateSchema,
} = require('../validation/schemas');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM investors ORDER BY name`,
        )
        res.json(rows);
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const data = InvestorCreateSchema.parse(req.body);
        const { rows } = await pool.query(
            `INSERT INTO investors (name, investor_type, email)
               VALUES ($1, $2, $3)`,
            [data.name, data.investor_type, data.email],
        )
        res.status(201).json(rows[0])
    } catch (error) {
        next(error)
    }
})

module.exports = router;