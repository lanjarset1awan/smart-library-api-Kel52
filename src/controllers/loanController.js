import { LoanModel } from '../models/loanModel.js';

export const LoanController = {
    async createLoan(req, res) {
        try {
            const { book_id, member_id, due_date } = req.body;
            const loan = await LoanModel.createLoan(book_id, member_id, due_date);
            res.status(201).json({
                message: "Peminjaman berhasil dicatat!",
                data: loan
            });
        } catch (err) {
            res.status(400).json({
                error: err.message
            });
        }
    },

    async getLoans(req, res) {
        try {
            const loans = await LoanModel.getAllLoans();
            res.json({
                message: "Data peminjaman berhasil diambil",
                data: loans
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    },

    async returnLoan(req, res) {
        try {
            const { loan_id } = req.body;

            if (!loan_id) {
                return res.status(400).json({
                    error: "loan_id wajib diisi"
                });
            }

            const result = await LoanModel.returnBook(loan_id);
            res.json({
                message: result.message
            });
        } catch (err) {
            res.status(400).json({
                error: err.message
            });
        }
    }
};
