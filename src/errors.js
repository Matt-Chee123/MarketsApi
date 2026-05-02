const { ZodError } = require('zod');

class NotFoundError extends Error {
    constructor(resource) {
        super(`${resource} not found`);
        this.name = 'NotFoundError';
    }
}

class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConflictError';
    }
}

function errorMiddleware(err, req, res, next) {
    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'validation_failed',
            details: err.issues.map(i => ({ path: i.path.join('.'), message: i.message })),
        });
    }

    if (err instanceof NotFoundError) {
        return res.status(404).json({ error: 'not_found', message: err.message });
    }

    if (err instanceof ConflictError) {
        return res.status(409).json({ error: 'conflict', message: err.message });
    }

    if (err.code === '23505') {
        return res.status(409).json({ error: 'conflict', message: 'Resource already exists' });
    }
    if (err.code === '23503') {
        return res.status(404).json({ error: 'not_found', message: 'Referenced resource does not exist' });
    }
    if (err.code === '22P02') {
        return res.status(400).json({ error: 'validation_failed', message: 'Invalid ID format' });
    }

    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'internal_server_error' });
}

module.exports = { NotFoundError, ConflictError, errorMiddleware };