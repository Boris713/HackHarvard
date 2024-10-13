// controllers/embeddingController.js

import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

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

const hf = new HfInference(process.env.HF_TOKEN);

// Function to handle database insertion
const insertEmbeddingIntoDB = async (text, embedding, name, environmental_score) => {
    const query = `
        INSERT INTO myvectortable (text, vector, id, environmental_score) 
        VALUES (?, JSON_ARRAY_PACK(?), ?, ?);
    `;

    console.log('Preparing to execute query:', {
        text,
        vector: JSON.stringify(embedding),
        name,
        environmental_score,
    });

    try {
        const result = await executeQuery(query, [text, JSON.stringify(embedding), name, environmental_score]);
        return result;
    } catch (error) {
        console.error('Error inserting record:', error);
        throw new Error('Error inserting record');
    }
};

export const generateTextEmbedding = async (req, res) => {
    const { text, name, environmental_score } = req.body;

    if (!text || !name) {
        return res.status(400).json({ error: 'Text and name are required' });
    }

    let embedding; // Declare the variable here
    try {
        embedding = await hf.featureExtraction({
            model: 'sentence-transformers/all-mpnet-base-v2',
            inputs: text,
        });

        // Optional: Log the generated embedding for debugging
        console.log('Generated embedding:', embedding);
    } catch (error) {
        console.error('Error generating embedding:', error);
        return res.status(500).json({ error: 'Failed to generate embedding' });
    }

    // Now the embedding is guaranteed to be defined if no error occurred
    try {
        const result = await insertEmbeddingIntoDB(text, embedding, name, environmental_score); // Call the updated function

        res.status(201).json({
            message: 'Record inserted successfully',
            insertedId: result.insertId, // Return the ID of the inserted row
        });
    } catch (error) {
        res.status(500).json({ error: 'Error inserting record', details: error.message });
    }
};
