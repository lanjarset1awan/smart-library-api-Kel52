import { MemberModel } from '../models/memberModel.js';

export const MemberController = {
    // Mendapatkan semua daftar anggota
    async getAllMembers(req, res) {
        try {
            const members = await MemberModel.getAll();
            res.json({
                message: "Members fetched",
                data: members
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const member = await MemberModel.getById(req.params.id);
            if (!member) {
                return res.status(404).json({ error: "Member not found" });
            }
            res.json({
                message: "Member found",
                data: member
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Mendaftarkan anggota baru
    async registerMember(req, res) {
        try {
            const newMember = await MemberModel.create(req.body);

            res.status(201).json({
                message: "Member created",
                data: newMember
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    async update(req, res) {
        try {
            const member = await MemberModel.update(req.params.id, req.body);
            res.json({
                message: "Member updated",
                data: member
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async delete(req, res) {
        try {
            const result = await MemberModel.delete(req.params.id);
            res.json({
                message: result.message
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};