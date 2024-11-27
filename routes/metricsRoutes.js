const express = require('express');
const { fetchInstagramMetrics } = require('../controllers/metricsController');

const router = express.Router();

// Fetch Instagram Metrics
router.get('/instagram', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).send('Missing user ID');

    try {
        const metrics = await fetchInstagramMetrics(userId);
        res.json({ message: 'Metrics fetched successfully', data: metrics });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
