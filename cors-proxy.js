const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Proxy endpoint for repos API
app.get('/api/repos', async (req, res) => {
    try {
        console.log('Fetching repos from static API...');
        const response = await fetch('https://static.retaketech.com/repos.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Successfully fetched repos data');
        res.json(data);
    } catch (error) {
        console.error('Error fetching repos:', error);
        res.status(500).json({ error: 'Failed to fetch repos data' });
    }
});

// Proxy endpoint for news API
app.get('/api/news', async (req, res) => {
    try {
        const days = req.query.days || '7';
        console.log(`Fetching news for ${days} days...`);
        
        const response = await fetch(`https://api.retaketech.com/news/?days=${days}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Successfully fetched news data');
        res.json(data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news data' });
    }
});

// Proxy endpoint for score API
app.get('/api/score', async (req, res) => {
    try {
        const slug = req.query.slug;
        if (!slug) {
            return res.status(400).json({ error: 'Slug parameter is required' });
        }
        
        console.log(`Fetching score for ${slug}...`);
        
        const response = await fetch(`https://api.retaketech.com/score?slug=${slug}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Successfully fetched score data');
        res.json(data);
    } catch (error) {
        console.error('Error fetching score:', error);
        res.status(500).json({ error: 'Failed to fetch score data' });
    }
});

app.listen(PORT, () => {
    console.log(`CORS proxy server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log(`  GET /api/repos - Proxy for static.retaketech.com/repos.json`);
    console.log(`  GET /api/news?days=7 - Proxy for api.retaketech.com/news/`);
    console.log(`  GET /api/score?slug=owner/repo - Proxy for api.retaketech.com/score`);
});
