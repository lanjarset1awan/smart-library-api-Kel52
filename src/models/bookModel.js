import { pool } from '../config/db.js';

export const BookModel = {
    // Mengambil semua buku dengan nama penulis dan kategori (JOIN)
    async getAllOld() {
        const query = `
      SELECT b.*, a.name as author_name, c.name as category_name 
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      LEFT JOIN categories c ON b.category_id = c.id
    `;
        const result = await pool.query(query);
        return result.rows;
    },

    async createOld(data) {
        const { isbn, title, author_id, category_id, total_copies } = data;
        const query = `
      INSERT INTO books (isbn, title, author_id, category_id, total_copies, available_copies)
      VALUES ($1, $2, $3, $4, $5, $5) RETURNING *
    `;
        const result = await pool.query(query, [isbn, title, author_id, category_id, total_copies]);
        return result.rows[0];
    },

    async deleteOld(id) {
        const query = 'DELETE FROM books WHERE id = $1';
        await pool.query(query, [id]);
        return { message: "Buku berhasil dihapus dari sistem." };
    },

    // GET ALL + SEARCH
    async getAll(title) {
        let query = `
      SELECT b.*, a.name as author_name, c.name as category_name
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      LEFT JOIN categories c ON b.category_id = c.id
    `;

        if (title) {
            query += ` WHERE b.title ILIKE $1`;
            const result = await pool.query(query, [`%${title}%`]);
            return result.rows;
        }

        const result = await pool.query(query);
        return result.rows;
    },

    // GET BY ID
    async getById(id) {
        const result = await pool.query(
            'SELECT * FROM books WHERE id=$1',
            [id]
        );
        return result.rows[0];
    },

    // CREATE
    async create(data) {
        const { isbn, title, author_id, category_id, total_copies } = data;

        const result = await pool.query(
            `INSERT INTO books (isbn, title, author_id, category_id, total_copies, available_copies)
       VALUES ($1,$2,$3,$4,$5,$5) RETURNING *`,
            [isbn, title, author_id, category_id, total_copies]
        );

        return result.rows[0];
    },

    // UPDATE
    async update(id, data) {
        const { title, total_copies } = data;

        const result = await pool.query(
            `UPDATE books 
       SET title=$1, total_copies=$2 
       WHERE id=$3 
       RETURNING *`,
            [title, total_copies, id]
        );

        return result.rows[0];
    },

    // DELETE
    async delete(id) {
        await pool.query(
            'DELETE FROM books WHERE id=$1',
            [id]
        );

        return { message: "Book deleted" };
    }

};