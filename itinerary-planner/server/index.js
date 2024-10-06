import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import cors from "cors";

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.post('/submit', (req, res) => {
    const data = JSON.stringify(req.body, null, 2) + ",";
    const filePath = path.join('server', 'formData.json');

    fs.appendFile(filePath, data, (err) => {
        if (err) {
            return res.status(500).send('Error writing to file');
        }
        res.status(200).send('Data written to file successfully');
    });
});

app.post('/clear', (req, res) => {
    const filePath = path.join('server', 'formData.json');
    fs.writeFile(filePath, '', (err) => {
        if (err) {
            return res.status(500).send('Error clearing file');
        }
    });
});

app.get("/api/get", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});