import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());
app.use(cors());
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

// Route to get the top 5 records based on dot_product score
app.get('/top-scores', async (req, res) => {
    try {
        const query = `
            SELECT text, dot_product(vector, JSON_ARRAY_PACK('[1]')) AS score
            FROM myvectortable
            ORDER BY score DESC
            LIMIT 5;
        `;
        const results = await executeQuery(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching top scores', details: error.message });
    }
});

app.post('/insert-record', async (req, res) => {
    const { text, vector, id } = req.body; // Expecting these fields in the request body

    if (!text || !vector || !id) {
        return res.status(400).json({ error: 'Text, vector, and id are required' });
    }

    try {
        const query = `
            INSERT INTO myvectortable (text, vector, id) 
            VALUES (?, JSON_ARRAY_PACK(?), ?);
        `;
        const result = await executeQuery(query, [text, JSON.stringify(vector), id]);

        res.status(201).json({
            message: 'Record inserted successfully',
            insertedId: result.insertId // Return the ID of the inserted row
        });
    } catch (error) {
        res.status(500).json({ error: 'Error inserting record', details: error.message });
    }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
