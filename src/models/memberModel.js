import { pool } from '../config/db.js';

export const MemberModel = {
    async getAll() {
        const result = await pool.query('SELECT * FROM members');
        return result.rows;
    },

    async getById(id) {
        const result = await pool.query('SELECT * FROM members WHERE id=$1', [id]);
        return result.rows[0];
    },

    async create(data) {
        const { full_name, email, member_type } = data;
        const result = await pool.query(
            'INSERT INTO members (full_name,email,member_type) VALUES ($1,$2,$3) RETURNING *',
            [full_name, email, member_type]
        );
        return result.rows[0];
    },

    async update(id, data) {
        const { full_name, email } = data;
        const result = await pool.query(
            'UPDATE members SET full_name=$1, email=$2 WHERE id=$3 RETURNING *',
            [full_name, email, id]
        );
        return result.rows[0];
    },

    async delete(id) {
        await pool.query('DELETE FROM members WHERE id=$1', [id]);
        return { message: "Member deleted" };
    }
};