const express = require('express');
const { pool } = require('./db');
const { errorMiddleware } = require('./errors');

const app = express();
app.use(express.json());

app.get('/health', async (req, res, next) => {
    try {
        await pool.query('SELECT 1');
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
});

app.use(errorMiddleware);

module.exports = { app };