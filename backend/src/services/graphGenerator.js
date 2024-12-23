// Generate graph data for influencers
const generateGraphData = (influencers) => {
  // Create nodes from influencers
  const nodes = influencers.map((influencer) => ({
    id: influencer._id, // Unique identifier
    label: influencer.name, // Name of the influencer
    value: influencer.rankScore, // Node size based on rank score
  }));

  // Create edges to represent interactions between influencers (placeholder logic)
  const edges = [];
  influencers.forEach((source, index) => {
    influencers.forEach((target, targetIndex) => {
      if (index !== targetIndex) {
        // Add an edge if there's a meaningful interaction
        const weight = Math.random() * source.rankScore * target.rankScore; // Example weight calculation
        edges.push({
          source: source._id,
          target: target._id,
          value: weight, // Edge weight
        });
      }
    });
  });

  return { nodes, edges };
};

module.exports = { generateGraphData };
