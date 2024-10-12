
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
    let embedding; // Declare the variable here
    try {
        embedding = await hf.featureExtraction({
            model: 'sentence-transformers/average_word_embeddings_glove.6B.300d',
            inputs: text,
        });

        // Optional: Log the generated embedding for debugging
        console.log('Generated embedding:', embedding);
        return embedding
    } catch (error) {
        console.error('Error generating embedding:', error);
        return res.status(500).json({ error: 'Failed to generate embedding' });
    }
};

// Function to query the database with the embedding
const querySemanticMatches = async (embedding) => {
    const query = `
        SELECT text,
               (dot_product(vector, JSON_ARRAY_PACK(?)) / 
                (LENGTH(vector) * LENGTH(JSON_ARRAY_PACK(?)))) AS score
        FROM myvectortable
        ORDER BY score DESC
        LIMIT 5;
    `;

    try {
        // Perform the query and get the top 5 results
        const result = await executeQuery(query, [JSON.stringify(embedding), JSON.stringify(embedding)]);
        return result;
    } catch (error) {
        console.error('Error querying semantic matches:', error);
        throw new Error('Failed to query database');
    }
};

// Create a new endpoint for semantic search
export const semanticSearch = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text input is required' });
    }

    try {
        // Step 1: Generate the text embedding for user input
        const embedding = await generateTextEmbedding(text);

        // Step 2: Query the database with the generated embedding
        const results = await querySemanticMatches(embedding);

        // Step 3: Return the results to the client
        res.status(200).json({
            message: 'Query successful',
            results,
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
};
