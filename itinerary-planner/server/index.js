import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import cors from "cors";
import { exec } from "child_process";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Adjust based on your frontend's URL
}));
app.use(bodyParser.json());

// Endpoint to submit form data and generate itinerary
app.post('/submit', (req, res) => {
    const data = JSON.stringify(req.body, null, 2);
    const filePath = path.join(__dirname, 'formData.json');

    // Write form data to formData.json
    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error("Error writing to formData.json:", err);
            return res.status(500).send('Error writing to file');
        }

        // Execute the Python script
        exec(`python3 ${path.join(__dirname, 'itinerary.py')} ${filePath}`, { env: process.env }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                console.error(`stderr: ${stderr}`);
                return res.status(500).send('Error generating itinerary');
            }
            if (stderr) {
                console.error(`Python script stderr: ${stderr}`);
                // You might choose to handle stderr differently based on your needs
            }

            try {
                const itineraryResponse = JSON.parse(stdout);
                if (itineraryResponse.error) {
                    // If the Python script returned an error
                    console.error(`Python script error: ${itineraryResponse.error}`);
                    return res.status(500).json({ error: itineraryResponse.error });
                }

                // Write the itinerary_html into locations.jsx
                const locationsFilePath = path.join(__dirname, '..', 'src', 'components', 'locations.jsx');

                // Build the content of locations.jsx
                const locationsJsxContent = `
import React from 'react'

const Locations = () => {
  return (
    <div id="locations" className="container">
        <header>
            <h1>Group Travel Itineraries</h1>
            <p>Explore Multiple Options for Your Next Adventure</p>
        </header>

        ${itineraryResponse.itinerary_html}

        <footer>
            <p>Happy Travels!</p>
        </footer>
    </div>
  )
}

export default Locations
`;

                // Write the content into locations.jsx
                fs.writeFile(locationsFilePath, locationsJsxContent, 'utf8', (err) => {
                    if (err) {
                        console.error("Error writing to locations.jsx:", err);
                        return res.status(500).send('Error writing to locations.jsx');
                    }
                    res.status(200).json({ message: 'Itinerary generated and saved to locations.jsx' });
                });

            } catch (parseError) {
                console.error("Error parsing Python script output:", parseError);
                console.error(`stdout: ${stdout}`);
                res.status(500).send('Error processing itinerary data');
            }
        });
    });
});

app.post('/clear', (req, res) => {
    const filePath = path.join(__dirname, 'formData.json');
    fs.writeFile(filePath, '', (err) => {
        if (err) {
            console.error("Error clearing formData.json:", err);
            return res.status(500).send('Error clearing file');
        }
        res.status(200).send('File cleared successfully');
    });
});

// Sample GET endpoint
app.get("/api/get", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});