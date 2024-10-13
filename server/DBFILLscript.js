import fs from 'fs';

// Load the JSON data from the file
const loadData = async () => {
    try {
        const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

        for (const company of data) {
            const { name, summary, esg_scores } = company;

            // Extract the most recent environmental score
            let environmental_score = null;
            if (esg_scores && esg_scores.length > 0) {
                // Assuming the latest score is the one with the highest year
                esg_scores.sort((a, b) => b.year - a.year);
                environmental_score = esg_scores[0].environmental_score;
            }

            // Prepare the text for embedding
            const text = `
                ${summary}
            `;

            // Send the data to your Express server for insertion using Fetch
            try {
                const response = await fetch('http://localhost:5173/api/embedding', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text,
                        name, // Use the company name as the ID or another unique identifier
                        environmental_score, // Include the environmental score
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const responseData = await response.json();
                console.log(`Inserted record for ${name}:`, responseData);
            } catch (error) {
                console.error(`Error inserting record for ${name}:`, error.message);
            }
        }

    } catch (error) {
        console.error('Error loading data:', error);
    }
};

// Call the loadData function
loadData();
