const mongoose = require('mongoose');

const InfluencerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  followers: { type: Number, required: true }, // Reach
  likes: { type: Number, default: 0 }, // Engagement
  comments: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  rankScore: { type: Number, default: 0 }, // Computed score
});

module.exports = mongoose.model('Influencer', InfluencerSchema);
