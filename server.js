const express = require('express');
const app = express();
const path = require('path');

// Railway automatically provides a port via the process.env.PORT variable
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Send index.html for the root route (optional, but good for safety)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/ai', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ai.html'));
});

app.get('/partners', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'partners.html'));
});


// Helper to load .env file manually if dotenv is not present (for local dev)
const fs = require('fs');
if (fs.existsSync('.env')) {
    const envConfig = fs.readFileSync('.env', 'utf-8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

app.use(express.json());

app.get('/composable-evolution', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'composable-evolution.html'));
});

app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key not configured on server.' });
    }

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', response.status, errorText);
            return res.status(response.status).json({ error: `Gemini API Error: ${response.statusText}` });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Server Error calling Gemini:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});