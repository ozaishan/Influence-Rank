const express = require('express');
const router = express.Router();
const Influencer = require('../models/influencerModel');
const { calculateRankScores } = require('../services/rankCalculator');
const { generateGraphData } = require('../services/graphGenerator');

// Add influencer data
router.post('/add-influencer', async (req, res) => {
  try {
    const { name, followers, likes, comments, shares } = req.body;
    const influencer = new Influencer({ name, followers, likes, comments, shares });
    await influencer.save();
    res.status(201).json({ message: 'Influencer added successfully', influencer });
  } catch (error) {
    res.status(500).json({ message: 'Error adding influencer', error });
  }
});

// Get influencers with ranks
router.get('/influencers', async (req, res) => {
  try {
    const influencers = await Influencer.find();
    const rankedInfluencers = await calculateRankScores(influencers);
    res.status(200).json(rankedInfluencers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching influencers', error });
  }
});

// Get graph data
router.get('/graph-data', async (req, res) => {
  try {
    const influencers = await Influencer.find(); // Fetch all influencers
    const rankedInfluencers = await calculateRankScores(influencers);
    const graphData = generateGraphData(rankedInfluencers);
    res.json(graphData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate graph data' });
  }
});

module.exports = router;
