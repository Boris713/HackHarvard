import express from 'express';
import dotenv from 'dotenv';
import embeddingRoutes from './routes/embeddingRoutes.js';
import cors from 'cors';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', embeddingRoutes);

app.listen(5000, () => {
    console.log('Server running on port 5000');
});