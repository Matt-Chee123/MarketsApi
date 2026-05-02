const express = require('express');
const { pool } = require('./db');
const { errorMiddleware } = require('./errors');
const fundsRouter = require('./routes/funds.js');
const investorsRouter = require('./routes/investors.js');
const investmentsRouter = require('./routes/investments.js');

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

app.use('/funds', fundsRouter)

app.use('/investors', investorsRouter)

// app.use('/funds/:fund_id/investments', investmentsRouter)

app.use(errorMiddleware);

module.exports = { app };