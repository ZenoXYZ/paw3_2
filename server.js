// Use .env for safety
require('dotenv').config()

// Configure express server
const express = require('express');
const app = express();

const API_BASE = "https://www.ncei.noaa.gov/cdo-web/api/v2";

// Files in directory public are static and for user use
app.use(express.static('public'));

async function proxyFetch(endpoint, res) {
    try {
        // Get data from NOAA API, use token from safe .env file
        const response = await fetch(
            `${API_BASE}${endpoint}`,
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
}

// Use route GET on localhost:3000/endpoint
app.get('/datasets', (req, res) => proxyFetch("/datasets", res));
app.get('/datacategories', (req, res) => proxyFetch("/datacategories", res));
app.get('/datatypes', (req, res) => proxyFetch("/datatypes", res));
app.get('/locationcategories', (req, res) => proxyFetch("/locationcategories", res));
app.get('/locations', (req, res) => proxyFetch("/locations", res));
app.get('/stations', (req, res) => proxyFetch("/stations", res));
// There should be a form with at least 3 required parameters:
// datasetid, startdate, enddate
// This is not required for this commit
app.get('/data', (req, res) => proxyFetch("/data?datasetid=GHCND&startdate=2010-05-01&enddate=2010-05-01", res));


// Turn on the express server on port 3000
app.listen(3000, () => {
    console.log(`Server is working: http://localhost:${3000}`);
});