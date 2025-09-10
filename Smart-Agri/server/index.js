require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Weather API endpoint
app.get('/api/weather/:latitude/:longitude', async (req, res) => {
    try {
        const { latitude, longitude } = req.params;
        // TODO: Implement weather API integration
        res.json({
            temperature: 28,
            humidity: 70,
            precipitation: 0.1,
            weatherType: 'sunny'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Crop advisory endpoint
app.get('/api/crop-advisory', async (req, res) => {
    try {
        // TODO: Implement crop advisory logic
        const advisory = {
            recommendedCrops: [
                { name: 'Rice', season: 'Kharif', waterRequirement: 'High' },
                { name: 'Wheat', season: 'Rabi', waterRequirement: 'Medium' }
            ],
            soilTypes: ['Alluvial', 'Black', 'Red'],
            weatherAlerts: [
                { type: 'Heat Wave', severity: 'Low', startDate: '2024-08-05' }
            ]
        };
        res.json(advisory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch crop advisory' });
    }
});

// Market price endpoint
app.get('/api/market-prices', async (req, res) => {
    try {
        const prices = {
            crops: [
                { name: 'Rice', currentPrice: 2500, unit: 'kg', trend: 'stable' },
                { name: 'Wheat', currentPrice: 2000, unit: 'kg', trend: 'up' },
                { name: 'Tomato', currentPrice: 30, unit: 'kg', trend: 'down' }
            ],
            lastUpdated: new Date().toISOString()
        };
        res.json(prices);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch market prices' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
