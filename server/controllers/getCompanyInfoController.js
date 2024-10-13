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

    // Check if the required fields are present
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
            companiesField = JSON.parse(companiesField) || []; // Parse as JSON or set an empty array
        }

        // Check if the company already exists in the user's companies list
        if (companiesField.includes(companyName)) {
            return res.status(400).json({ message: 'Company already exists in the user\'s companies list' });
        }

        // Add the new company to the list
        companiesField.push(companyName);

        // Update the companies field in the user profile
        await executeQuery(updateUserCompaniesQuery, [JSON.stringify(companiesField), userID]);

        res.status(200).json({ message: `Successfully added ${companyName} to user ${userID}` });

    } catch (error) {
        console.error('Error adding company to user:', error);
        res.status(500).json({ message: 'Error adding company to user.', details: error.message });
    }
};
