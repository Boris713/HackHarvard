import express from 'express';
import dotenv from 'dotenv';
import embeddingRoutes from './routes/embeddingRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());

app.use('/api', embeddingRoutes);

app.listen(5173, () => {
    console.log('Server running on port 5173');
});