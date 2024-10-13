import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();
const hf = new HfInference(process.env.HF_TOKEN);

// Setup database connection
const db = mysql.createConnection({
    host: 'svc-69727c1f-81cc-47e6-bd46-d0f87b891b64-dml.aws-virginia-7.svc.singlestore.com',
    port: 3306,
    user: 'admin',
    password: process.env.PASSWORD,
    database: 'EGSV',
});

function executeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

// Function to generate text embedding using Hugging Face
const generateTextEmbedding = async (text) => {
    let embedding;
    try {
        embedding = await hf.featureExtraction({
            model: 'sentence-transformers/average_word_embeddings_glove.6B.300d',
            inputs: text,
        });

        // If the embedding is nested (e.g., [[number, number, ...]]), extract the inner array
        if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
            embedding = embedding[0];
        }

        console.log('Generated embedding:', embedding);
        return embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw new Error('Failed to generate embedding');
    }
};

// Function to query the database with the embedding
const querySemanticMatches = async (embedding) => {
    const query = `
        SELECT 
            id,
            text,
            environmental_score,
            (dot_product(vector, JSON_ARRAY_PACK(?)) / 
             (LENGTH(vector) * LENGTH(JSON_ARRAY_PACK(?)))) AS score
        FROM myvectortable
        ORDER BY score DESC
        LIMIT 5;
    `;

    try {
        const embeddingString = embedding.join(','); // Convert embedding array to comma-separated string
        const result = await executeQuery(query, [embeddingString, embeddingString]);
        return result;
    } catch (error) {
        console.error('Error querying semantic matches:', error);
        throw new Error('Failed to query database');
    }
};

// Controller function for estimating sustainability score
export const estimateSustainabilityScore = async (req, res) => {
    const { description } = req.body;

    if (!description) {
        return res.status(400).json({ error: 'Company description is required' });
    }

    try {
        // Step 1: Generate the text embedding for user input
        const embedding = await generateTextEmbedding(description);

        // Step 2: Query the database with the generated embedding
        const results = await querySemanticMatches(embedding);

        if (results.length === 0) {
            return res.status(200).json({
                message: 'No similar companies found.',
                estimated_score: null,
                companies_used: [],
            });
        }

        // Step 3: Convert environmental_score to number and calculate the average
        const totalScore = results.reduce((acc, company) => {
            const score = parseFloat(company.environmental_score);
            return acc + score;
        }, 0);
        const averageScore = totalScore / results.length;

        // Round the averageScore to two decimal places without converting to string
        const roundedAverageScore = Math.round((averageScore + Number.EPSILON) * 100) / 100;

        // Step 4: Return the estimated score and the company descriptions
        res.status(200).json({
            message: 'Estimation successful',
            estimated_score: roundedAverageScore, // Now a number
            companies_used: results.map((company) => ({
                name: company.id,
                summary: company.text,
                environmental_score: parseFloat(company.environmental_score), // Ensure it's a number
            })),
        });
    } catch (error) {
        console.error('Error in estimateSustainabilityScore:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
};
