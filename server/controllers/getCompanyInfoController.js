import mysql from 'mysql2';
import dotenv from 'dotenv';

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

export const getAllCompanies = async (req, res) => {
    const query = `SELECT name, industry, env_score, logo_url FROM companies;`;
    try {
        const companies = await executeQuery(query);
        if (companies.length === 0) {
            return res.status(404).json({ message: 'No companies found' });
        }
        res.status(200).json(companies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ message: 'Error fetching companies.' });
    }
};

export const getCompanyByName = async (req, res) => {
    const companyName = req.params.name;
    const query = `SELECT * FROM companies WHERE name = ?;`;

    try {
        const company = await executeQuery(query, [companyName]);

        if (company.length === 0) {
            return res.status(404).json({ message: `No company found with the name ${companyName}` });
        }

        res.status(200).json(company[0]);
    } catch (error) {
        console.error('Error fetching company by name:', error);
        res.status(500).json({ message: 'Error fetching company data.' });
    }
};

export const getCompaniesByUser = async (req, res) => {
    const userID = req.params.ID;
    const query = `SELECT companies FROM user_profiles WHERE ID = ?;`;

    try {
        // Fetch user profile based on the ID
        const userProfile = await executeQuery(query, [userID]);

        // Check if the user profile exists
        if (userProfile.length === 0) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        // Get the companies field, assuming it's stored as a JSON array
        const companiesField = userProfile[0].companies;

        // Check if the companiesField is an array
        if (!Array.isArray(companiesField)) {
            return res.status(404).json({ message: 'No companies associated with this user' });
        }

        // Ensure the array is not empty
        if (companiesField.length === 0) {
            return res.status(404).json({ message: 'No companies associated with this user' });
        }

        // Construct the placeholders for the IN clause (e.g., ?,?,?)
        const placeholders = companiesField.map(() => '?').join(',');

        // Query to fetch the company details for the companies in the list
        const companiesQuery = `SELECT name, industry, env_score, logo_url FROM companies WHERE name IN (${placeholders});`;

        // Execute the query with the company names as parameters
        const companies = await executeQuery(companiesQuery, companiesField);

        // Check if any companies were found
        if (companies.length === 0) {
            return res.status(404).json({ message: 'No companies found for this user' });
        }

        // Return the list of companies
        res.status(200).json(companies);

    } catch (error) {
        console.error('Error fetching companies by user:', error);
        res.status(500).json({ message: 'Error fetching companies by user.', details: error.message });
    }
};

export const addCompanyToUser = async (req, res) => {
    const { userID, companyName } = req.body;

    if (!userID || !companyName) {
        return res.status(400).json({ message: 'User ID and company name are required' });
    }

    const getUserCompaniesQuery = `SELECT companies FROM user_profiles WHERE ID = ?;`;
    const updateUserCompaniesQuery = `UPDATE user_profiles SET companies = ? WHERE ID = ?;`;

    try {
        // Fetch the user's current list of companies
        const userProfile = await executeQuery(getUserCompaniesQuery, [userID]);

        if (userProfile.length === 0) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        let companiesField = userProfile[0].companies;

        // Check if the companies field is an array (if stored as JSON)
        if (!Array.isArray(companiesField)) {
            companiesField = JSON.parse(companiesField) || [];
        }

        // Check if the company already exists in the user's companies list
        if (companiesField.includes(companyName)) {
            return res.status(400).json({ message: 'Company already exists in the user\'s companies list' });
        }

        // Add the new company to the list
        companiesField.push(companyName);

        // Update the companies field in the user profile
        await executeQuery(updateUserCompaniesQuery, [JSON.stringify(companiesField), userID]);

        // Update the personalized sustainability score
        await updatePersonalizedSustainabilityScore(userID);

        res.status(200).json({ message: `Successfully added ${companyName} to user ${userID}` });

    } catch (error) {
        console.error('Error adding company to user:', error);
        res.status(500).json({ message: 'Error adding company to user.', details: error.message });
    }
};

export const deleteCompanyFromUser = async (req, res) => {
    const { userID, companyName } = req.body;

    if (!userID || !companyName) {
        return res.status(400).json({ message: 'User ID and company name are required' });
    }

    const getUserCompaniesQuery = `SELECT companies FROM user_profiles WHERE ID = ?;`;
    const updateUserCompaniesQuery = `UPDATE user_profiles SET companies = ? WHERE ID = ?;`;

    try {
        // Fetch the user's current list of companies
        const userProfile = await executeQuery(getUserCompaniesQuery, [userID]);

        if (userProfile.length === 0) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        let companiesField = userProfile[0].companies;

        // Check if the companies field is an array (if stored as JSON)
        if (!Array.isArray(companiesField)) {
            companiesField = JSON.parse(companiesField) || [];
        }

        // Check if the company exists in the user's companies list
        const companyIndex = companiesField.indexOf(companyName);
        if (companyIndex === -1) {
            return res.status(400).json({ message: 'Company not found in the user\'s companies list' });
        }

        // Remove the company from the list
        companiesField.splice(companyIndex, 1);

        // Update the companies field in the user profile
        await executeQuery(updateUserCompaniesQuery, [JSON.stringify(companiesField), userID]);

        // Update the personalized sustainability score
        await updatePersonalizedSustainabilityScore(userID);

        res.status(200).json({ message: `Successfully removed ${companyName} from user ${userID}` });

    } catch (error) {
        console.error('Error removing company from user:', error);
        res.status(500).json({ message: 'Error removing company from user.', details: error.message });
    }
};

export const updateUserScore = async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        await updatePersonalizedSustainabilityScore(userID);
        res.status(200).json({ message: `Updated personalized sustainability score for user ${userID}` });
    } catch (error) {
        res.status(500).json({ message: 'Error updating personalized sustainability score', details: error.message });
    }
};

// Function to update the personalized sustainability score
export const updatePersonalizedSustainabilityScore = async (userID) => {
    const getUserCompaniesQuery = `SELECT companies FROM user_profiles WHERE ID = ?;`;
    const getCompanyScoresQuery = `
        SELECT env_score FROM companies 
        WHERE name IN (?) 
        ORDER BY name ASC, env_score DESC;
    `;
    const updateUserScoreQuery = `UPDATE user_profiles SET personalized_sustainability_score = ? WHERE ID = ?;`;

    try {
        // Fetch the user's current list of companies
        const userProfile = await executeQuery(getUserCompaniesQuery, [userID]);

        if (userProfile.length === 0) {
            throw new Error('User profile not found');
        }

        let companiesField = userProfile[0].companies;

        // Check if the companies field is an array (if stored as JSON)
        if (!Array.isArray(companiesField)) {
            companiesField = JSON.parse(companiesField) || [];
        }

        // If no companies, set the score to 0
        if (companiesField.length === 0) {
            await executeQuery(updateUserScoreQuery, [0, userID]);
            return;
        }

        // Fetch the most recent env_score for each company in the user's companies list
        const placeholders = companiesField.map(() => '?').join(',');
        const recentScores = await executeQuery(getCompanyScoresQuery.replace('?', placeholders), companiesField);

        // Make sure we have scores for each company
        if (recentScores.length === 0) {
            await executeQuery(updateUserScoreQuery, [0, userID]);
            return;
        }

        // Calculate the average env_score across all fetched companies
        const totalScore = recentScores.reduce((sum, score) => sum + parseFloat(score.env_score), 0);
        const averageScore = totalScore / recentScores.length;

        // Update the personalized_sustainability_score in user_profiles
        await executeQuery(updateUserScoreQuery, [averageScore, userID]);

    } catch (error) {
        console.error('Error updating personalized sustainability score:', error);
        throw new Error('Error updating personalized sustainability score.');
    }
};
