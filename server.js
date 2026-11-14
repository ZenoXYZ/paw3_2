// Use .env for safety
require('dotenv').config()

// Configure express server
const express = require('express');
const app = express();

// Files in directory public are static and for user use
app.use(express.static('public'));

// Use route GET on localhost:3000/stations
// Function is async
app.get('/stations', async(req, res) => {
    try {
        // Get data from NOAA API, use token from safe .env file
        const response = await fetch(
            "https://www.ncei.noaa.gov/cdo-web/api/v2/stations",
            {
                headers: {
                    token: process.env.NOAA_API_KEY
                }
            }
        )
        
        // Check for response error
        if (!response.ok) {
            const errorText = await response.text();

            return res.status(response.status).json({
                error: "NOAA Error",
                status: response.status,
                details: errorText
            });
        }

        // Get json data from response and send back to client
        const data = await response.json();

        res.json(data);
    }
    // Catch server and network errors
    catch (error) {
        console.error('Server error:', error);

        res.status(500).json({
            error: 'Server error',
            details: error.message
        });
    }
})

// Turn on the express server on port 3000
app.listen(3000, () => {
    console.log(`Server is working: http://localhost:${3000}`);
});