import fs from 'fs';

// Load the JSON data from the file
const loadData = async () => {
    try {
        const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

        for (const company of data) {
            const { name, summary } = company;


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
