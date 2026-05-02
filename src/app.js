const express = require('express');
const { pool } = require('./db');

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

module.exports = { app };