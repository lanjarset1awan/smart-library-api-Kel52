import { pool } from '../config/db.js';

export const ReportModel = {

  async getStats() {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM books) AS total_books,
        (SELECT COUNT(*) FROM authors) AS total_authors,
        (SELECT COUNT(*) FROM categories) AS total_categories,
        (SELECT COUNT(*) FROM loans WHERE status = 'BORROWED') AS borrowed_books
    `;

    const result = await pool.query(query);
    return result.rows[0];
  },

  async getTopBooks() {
    const query = `
      SELECT 
        b.id,
        b.title,
        COUNT(l.id) AS total_loans
      FROM books b
      LEFT JOIN loans l ON b.id = l.book_id
      GROUP BY b.id, b.title
      ORDER BY total_loans DESC
      LIMIT 5
    `;

    const result = await pool.query(query);
    return result.rows;
  }
};