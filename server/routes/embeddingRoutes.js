import express from 'express';
import { generateTextEmbedding } from '../controllers/embeddingController.js';
import { semanticSearch } from '../controllers/semanticSearchController.js';
import { estimateSustainabilityScore } from '../controllers/companyEstimateController.js';
import { getAllCompanies, getCompanyByName } from '../controllers/getCompanyInfoController.js';
import { getCompaniesByUser } from '../controllers/getCompanyInfoController.js';
import { addCompanyToUser } from '../controllers/getCompanyInfoController.js';

const router = express.Router();

router.post('/embedding', generateTextEmbedding);
router.post('/semanticSearch',semanticSearch);
router.post('/estimateScore', estimateSustainabilityScore);
router.get('/companies', getAllCompanies);
router.get('/company/name/:name', getCompanyByName);
router.get('/user/:ID/companies', getCompaniesByUser);
router.post('/user/addCompany', addCompanyToUser);

export default router;