import express from 'express';
import { generateTextEmbedding } from '../controllers/embeddingController.js';
import { semanticSearch } from '../controllers/semanticSearchController.js';
import { estimateSustainabilityScore } from '../controllers/companyEstimateController.js';

const router = express.Router();

router.post('/embedding', generateTextEmbedding);
router.post('/semanticSearch',semanticSearch);
router.post('/estimateScore', estimateSustainabilityScore);

export default router;