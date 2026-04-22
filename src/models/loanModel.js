import { pool } from '../config/db.js';

export const LoanModel = {
    async createLoan(book_id, member_id, due_date) {
        const client = await pool.connect(); // Menggunakan client untuk transaksi
        try {
            await client.query('BEGIN'); // Mulai transaksi database

            // 1. Cek ketersediaan buku
            const bookCheck = await client.query('SELECT available_copies FROM books WHERE id = $1', [book_id]);
            if (bookCheck.rows.length === 0) {
                throw new Error('Buku tidak ditemukan');
            }

            if (bookCheck.rows[0].available_copies <= 0) {
                throw new Error('Buku sedang tidak tersedia (stok habis).');
            }

            // 2. Kurangi stok buku
            await client.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = $1', [book_id]);

            // 3. Catat transaksi peminjaman
            const loanQuery = `
                INSERT INTO loans (book_id, member_id, due_date, status) 
                VALUES ($1, $2, $3, 'BORROWED') RETURNING *
            `;
            const result = await client.query(loanQuery, [book_id, member_id, due_date]);

            await client.query('COMMIT'); // Simpan semua perubahan
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK'); // Batalkan jika ada error
            throw error;
        } finally {
            client.release();
        }
    },

    async getAllLoans() {
        const query = `
        SELECT 
        l.*, 
        b.title as book_title, 
        m.full_name as member_name 
        FROM loans l
        JOIN books b ON l.book_id = b.id
        JOIN members m ON l.member_id = m.id
        ORDER BY l.loan_date DESC
    `;
        const result = await pool.query(query);
        return result.rows;
    },

    async returnBook(loan_id) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 1. cek loan ada atau tidak
            const loanCheck = await client.query(
                'SELECT * FROM loans WHERE id = $1',
                [loan_id]
            );

            if (loanCheck.rows.length === 0) {
                throw new Error('Data peminjaman tidak ditemukan');
            }

            const loan = loanCheck.rows[0];

            if (loan.status === 'RETURNED') {
                throw new Error('Buku sudah dikembalikan sebelumnya');
            }

            const book_id = loan.book_id;

            // 2. update status loan
            await client.query(
                `UPDATE loans 
            SET status = 'RETURNED', return_date = NOW() 
            WHERE id = $1`,
                [loan_id]
            );

            // 3. tambah stok buku
            await client.query(
                `UPDATE books 
            SET available_copies = available_copies + 1 
            WHERE id = $1`,
                [book_id]
            );

            await client.query('COMMIT');

            return { message: "Book returned successfully" };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    // STATS REPORT
    async getStats() {
        const result = await pool.query(`
    SELECT
        (SELECT COUNT(*) FROM books) AS total_books,
        (SELECT COUNT(*) FROM authors) AS total_authors,
        (SELECT COUNT(*) FROM categories) AS total_categories,
        (SELECT COUNT(*) FROM loans WHERE status = 'BORROWED') AS borrowed_books
    `);

        return result.rows[0];
    }
};