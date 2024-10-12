import express from 'express';
import { generateTextEmbedding } from '../controllers/embeddingController.js';

const router = express.Router();

router.post('/embedding', generateTextEmbedding);

export default router;