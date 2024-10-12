import express from 'express';
import { generateTextEmbedding } from '../controllers/embeddingController.js';
import { semanticSearch } from '../controllers/semanticSearchController.js';

const router = express.Router();

router.post('/embedding', generateTextEmbedding);
router.post('/semanticSearch',semanticSearch);
export default router;