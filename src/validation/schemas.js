const { z } = require('zod');

const FundCreateSchema = z.object({
    name: z.string().min(1).max(255),
    vintage_year: z.number().int().gte(1900).lte(2100),
    target_size_usd: z.number().positive(),
    status: z.enum(['Fundraising', 'Investing', 'Closed']),
});

const FundUpdateSchema = FundCreateSchema.extend({
    id: z.uuid(),
});

const InvestorCreateSchema = z.object({
    name: z.string().min(1).max(255),
    investor_type: z.enum(['Individual', 'Institution', 'Family Office']),
    email: z.email(),
});

const InvestmentCreateSchema = z.object({
    investor_id: z.uuid(),
    amount_usd: z.number().positive(),
    investment_date: z.iso.date(),
});

const UuidSchema = z.uuid();

module.exports = {
    FundCreateSchema,
    FundUpdateSchema,
    InvestorCreateSchema,
    InvestmentCreateSchema,
    UuidSchema,
};