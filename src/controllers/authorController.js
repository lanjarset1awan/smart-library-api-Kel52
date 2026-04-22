import { AuthorModel } from '../models/authorModel.js';

export const AuthorController = {
    async getAuthors(req, res) {
        try {
            const { name } = req.query;
            const authors = await AuthorModel.getAll(name);
            res.json({
                message: "Authors fetched successfully",
                data: authors
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const author = await AuthorModel.getById(req.params.id);
            if (!author) {
                return res.status(404).json({ error: "Author not found" });
            }
            res.json({
                message: "Author found",
                data: author
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const { name, nationality } = req.body;
            const author = await AuthorModel.create(name, nationality);
            res.status(201).json({
                message: "Author created",
                data: author
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const { name, nationality } = req.body;
            const author = await AuthorModel.update(
                req.params.id,
                name,
                nationality
            );
            res.json({
                message: "Author updated",
                data: author
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async delete(req, res) {
        try {
            const result = await AuthorModel.delete(req.params.id);
            res.json({
                message: result.message
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
