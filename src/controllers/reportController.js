import { LoanModel } from '../models/loanModel.js';

export const ReportController = {
    async getStats(req, res) {
        try {
            const stats = await LoanModel.getStats();

            res.json({
                message: "Stats fetched",
                data: stats
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};