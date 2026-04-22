import { BookModel } from '../models/bookModel.js';

export const BookController = {
    async getAllBooks(req, res) {
        try {
            const { title } = req.query;
            const books = await BookModel.getAll(title);

            res.json({
                message: "Books fetched",
                data: books
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const book = await BookModel.getById(req.params.id);

            if (!book) {
                return res.status(404).json({ error: "Book not found" });
            }

            res.json({
                message: "Book found",
                data: book
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async createBook(req, res) {
        try {
            const newBook = await BookModel.create(req.body);

            res.status(201).json({
                message: "Book created",
                data: newBook
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const book = await BookModel.update(req.params.id, req.body);

            res.json({
                message: "Book updated",
                data: book
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async delete(req, res) {
        try {
            const result = await BookModel.delete(req.params.id);

            res.json({
                message: result.message
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};