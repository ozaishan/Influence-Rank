// Rank calculation logic
const calculateRankScores = async (influencers) => {
  // Example weights for engagement metrics
  const weights = {
    likes: 1,
    comments: 2,
    shares: 1.5,
  };

  // Calculate rank score for each influencer
  influencers.forEach((influencer) => {
    influencer.rankScore =
      (weights.likes * influencer.likes +
        weights.comments * influencer.comments +
        weights.shares * influencer.shares) *
      Math.log10(1 + influencer.followers); // Scale based on followers
  });

  // Normalize rank scores
  const maxScore = Math.max(...influencers.map((i) => i.rankScore));
  influencers.forEach((influencer) => {
    influencer.rankScore = influencer.rankScore / maxScore; // Normalize to range [0, 1]
  });

  return influencers;
};

module.exports = { calculateRankScores };
