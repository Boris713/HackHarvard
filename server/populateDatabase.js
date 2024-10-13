import mysql from 'mysql2';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create the database connection
const db = mysql.createConnection({
    host: 'svc-69727c1f-81cc-47e6-bd46-d0f87b891b64-dml.aws-virginia-7.svc.singlestore.com',
    port: 3306,
    user: 'admin',
    password: process.env.PASSWORD,
    database: 'EGSV',
});

// Utility function to execute queries
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

// Read the data.json file
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

// Hardcoded logo paths for companies with special naming conventions
const customLogos = {
    "Facebook (Meta Platforms)": "facebook_logo.png",
    "Google (Alphabet Inc.)": "google_logo.png",
    "Blue Bottle Coffee": "blue_bottle_coffee_logo.jpg",
    "Lush Cosmetics": "lush_cosmetics_logo.png",
    "Ben & Jerry's": "benjerrys_logo.png",
    "Dr. Bronner's": "drbronners_logo.png",
    "ExxonMobil": "exxon_logo.png",
    "Burt's Bees": "burtsbees_logo.png"
};

// Function to insert or update companies in the database
const insertOrUpdateCompanyData = async (company) => {
    const { name, industry, size, summary, location, esg_scores, predicted_score } = company;

    // Extract the environmental scores over the years
    const environmentalScores = esg_scores.map(score => score.environmental_score);
    const environmentalScoresJson = JSON.stringify(environmentalScores);

    // If location, summary, or predicted_score is null or undefined, ensure they're handled properly
    const companyLocation = location || "Not Available";
    const companySummary = summary || "No summary available";
    const companyPredictedScore = predicted_score || 0.0;

    // Check for a hardcoded logo path
    let logoPath = customLogos[name] ? `./images/${customLogos[name]}` : null;

    // If no hardcoded logo path, check for logo using standard naming convention
    if (!logoPath) {
        const imageFolder = './images';
        const possibleExtensions = ['.png', '.jpg', '.jpeg'];
        for (let ext of possibleExtensions) {
            const logoFile = `${name.replace(/\s+/g, '_').toLowerCase()}_logo${ext}`;
            const fullPath = path.join(imageFolder, logoFile);
            if (fs.existsSync(fullPath)) {
                logoPath = `./images/${logoFile}`;
                break;
            }
        }
    }

    if (!logoPath) {
        console.log(`Logo not found for ${name}`);
    }

    // Use ON DUPLICATE KEY UPDATE to insert or update company data
    const query = `
        INSERT INTO companies (name, industry, size, location, env_score, summary, predicted_score, logo_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            industry = VALUES(industry), 
            size = VALUES(size), 
            location = VALUES(location),
            env_score = VALUES(env_score), 
            summary = VALUES(summary), 
            predicted_score = VALUES(predicted_score), 
            logo_url = VALUES(logo_url);
    `;

    const params = [
        name, 
        industry, 
        size, 
        companyLocation, 
        environmentalScoresJson,
        companySummary,
        companyPredictedScore,
        logoPath || null
    ];

    try {
        await executeQuery(query, params);
        console.log(`Inserted/Updated data for company: ${name}`);
    } catch (error) {
        console.error(`Error inserting/updating data for ${name}:`, error.message);
    }
};

// Function to insert the user into the user_profiles table
const insertUserProfile = async () => {
    const userID = 1;
    const userName = 'Nico';
    const companies = JSON.stringify(['Microsoft', 'Allbirds', 'Sweetgreen']); // Convert array to JSON string
    const sustainabilityScore = 6.2;

    const query = `
        INSERT INTO user_profiles (ID, name, companies, personalized_sustainability_score) 
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            companies = VALUES(companies),
            personalized_sustainability_score = VALUES(personalized_sustainability_score);
    `;

    const params = [userID, userName, companies, sustainabilityScore];

    try {
        await executeQuery(query, params);
        console.log(`Inserted/Updated user: ${userName}`);
    } catch (error) {
        console.error(`Error inserting/updating user: ${error.message}`);
    }
};

// Function to populate the database and ensure all asynchronous operations complete before closing the connection
const populateDatabase = async () => {
    try {
        for (let company of data) {
            await insertOrUpdateCompanyData(company);
        }

        // Insert the user profile after the companies have been inserted
        await insertUserProfile();

    } catch (error) {
        console.error("Error during database population:", error.message);
    } finally {
        // Ensure that the database connection is only closed after all operations are done
        db.end();
    }
};

// Call the function to start populating the database
populateDatabase();
