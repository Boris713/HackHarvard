import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();
const hf = new HfInference(process.env.HF_TOKEN);

export const generateTextEmbedding = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text required' });
    }

    try {
        const embedding = await hf.featureExtraction({
            model: 'intfloat/e5-small-v2',
            inputs: text,
        });

        console.log('Embedding:', embedding);
        res.status(200).json({ embedding });
    } catch (error) {
        console.error('Error generating embedding:', error);
        res.status(500).json({ error: 'Failed to generate embedding' });
    }
};