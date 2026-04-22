import { CategoryModel } from '../models/categoryModel.js';

export const CategoryController = {
    async getCategories(req, res) {
        try {
            const { name } = req.query;
            const categories = await CategoryModel.getAll(name);
            res.json({
                message: "Categories fetched",
                data: categories
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const category = await CategoryModel.getById(req.params.id);
            if (!category) {
                return res.status(404).json({ error: "Category not found" });
            }
            res.json({
                message: "Category found",
                data: category
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const category = await CategoryModel.create(req.body.name);
            res.status(201).json({
                message: "Category created",
                data: category
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const category = await CategoryModel.update(
                req.params.id,
                req.body.name
            );
            res.json({
                message: "Category updated",
                data: category
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async delete(req, res) {
        try {
            const result = await CategoryModel.delete(req.params.id);
            res.json({
                message: result.message
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
