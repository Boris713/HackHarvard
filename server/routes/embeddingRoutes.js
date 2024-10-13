import express from 'express';
import { generateTextEmbedding } from '../controllers/embeddingController.js';
import { semanticSearch } from '../controllers/semanticSearchController.js';
import { estimateSustainabilityScore } from '../controllers/companyEstimateController.js';
import { getAllCompanies, getCompanyByName, getCompaniesByUser, addCompanyToUser, deleteCompanyFromUser, updateUserScore } from '../controllers/getCompanyInfoController.js';
import { getUserProfile } from '../controllers/getCompanyInfoController.js';

const router = express.Router();

router.post('/embedding', generateTextEmbedding);
router.post('/semanticSearch', semanticSearch);
router.post('/estimateScore', estimateSustainabilityScore);
router.get('/companies', getAllCompanies);
router.get('/company/name/:name', getCompanyByName);
router.get('/user/:ID/companies', getCompaniesByUser);
router.post('/user/addCompany', addCompanyToUser);
router.post('/user/deleteCompany', deleteCompanyFromUser);
router.post('/user/updateScore', updateUserScore);
router.get('/user/:ID/profile', getUserProfile);

export default router;
