import express from 'express';
import { BookController } from '../controllers/bookController.js';

const router = express.Router();

router.get('/', BookController.getAllBooks);
router.get('/:id', BookController.getById);
router.post('/', BookController.createBook);
router.put('/:id', BookController.update);
router.delete('/:id', BookController.delete);

export default router;
