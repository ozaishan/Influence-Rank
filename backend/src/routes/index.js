// const express = require('express');
// const router = express.Router();
// const Influencer = require('../models/influencerModel');
// const { calculateRankScores } = require('../services/rankCalculator');
// const { generateGraphData } = require('../services/graphGenerator');

// // Add influencer data
// router.post('/add-influencer', async (req, res) => {
//   try {
//     console.log('Request body:', req.body); 
//     const { name, followers, likes, comments, shares } = req.body;
//     const influencer = new Influencer({ name, followers, likes, comments, shares });
//     await influencer.save();
//     res.status(201).json({ message: 'Influencer added successfully', influencer });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding influencer', error });
//   }
// });

// // Get influencers with ranks
// router.get('/influencers', async (req, res) => {
//   try {
//     const influencers = await Influencer.find();
//     const rankedInfluencers = await calculateRankScores(influencers);
//     res.status(200).json(rankedInfluencers);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching influencers', error });
//   }
// });

// // Get graph data
// router.get('/graph-data', async (req, res) => {
//   try {
//     const influencers = await Influencer.find(); // Fetch all influencers
//     const rankedInfluencers = await calculateRankScores(influencers);
//     const graphData = generateGraphData(rankedInfluencers);
//     res.json(graphData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to generate graph data' });
//   }
// });

// module.exports = router;
const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const Influencer = require('../models/influencerModel');
const { calculateRankScores } = require('../services/rankCalculator');
const { generateGraphData } = require('../services/graphGenerator');


const router = express.Router();
function convertToNumber(value) {
  if (typeof value === 'string') {
    if (value.endsWith('m')) {
      return parseFloat(value.replace('m', '')) * 1_000_000;
    } else if (value.endsWith('k')) {
      return parseFloat(value.replace('k', '')) * 1_000;
    }
  }
  return parseFloat(value) || 0;
}
// Add a single influencer
router.post('/add-influencer', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { name, followers, likes, comments, shares } = req.body;
    const influencer = new Influencer({ name, followers, likes, comments, shares });
    await influencer.save();
    res.status(201).json({ message: 'Influencer added successfully', influencer });
  } catch (error) {
    res.status(500).json({ message: 'Error adding influencer', error });
  }
});

// Get all influencers with ranks
router.get('/influencers', async (req, res) => {
  try {
    const influencers = await Influencer.find();
    const rankedInfluencers = await calculateRankScores(influencers);
    res.status(200).json(rankedInfluencers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching influencers', error });
  }
});

// Get graph data for visualization
// Get graph data for visualization
router.get('/graph-data', async (req, res) => {
  try {
    const influencers = await Influencer.find(); // Fetch all influencers
    const rankedInfluencers = await calculateRankScores(influencers); // Calculate ranks and update
    const graphData = generateGraphData(rankedInfluencers); // Generate graph data based on ranked influencers
    res.json(graphData); // Send the graph data as response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate graph data' });
  }
});
// Import CSV and update ranks
router.post('/import-csv', async (req, res) => {
  try {
    const filePath = './src/updated_cleaned_influencers_data.csv'; // Adjusted path
    const influencers = [];

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ message: `File not found at path: ${filePath}` });
    }

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        influencers.push({
          name: row.name,
          followers: convertToNumber(row.followers),
          likes: convertToNumber(row.likes),
          comments: convertToNumber(row.comments),
          shares: convertToNumber(row.shares),
        });
      })
      .on('end', async () => {
        try {
          await Influencer.insertMany(influencers); // Insert influencers into DB
          console.log('CSV data imported successfully!');

          // Recalculate and update ranks after importing the data
          const allInfluencers = await Influencer.find();
          const rankedInfluencers = await calculateRankScores(allInfluencers); // Calculate and update ranks

          res.status(201).json({
            message: 'CSV data imported and ranks calculated successfully',
            rankedInfluencers, // Send the ranked influencers as response
          });
        } catch (error) {
          res.status(500).json({ message: 'Error processing CSV data', error });
        }
      });
  } catch (error) {
    res.status(500).json({ message: 'Error importing CSV file', error });
  }
});

module.exports = router;
