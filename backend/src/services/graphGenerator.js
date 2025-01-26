const testData = {
  nodes: [
    { id: "1", name: "Influencer A", value: 3 },
    { id: "2", name: "Influencer B", value: 2 },
    { id: "3", name: "Influencer C", value: 4 },
  ],
  edges: [
    { source: "1", target: "2", value: 1 },
    { source: "2", target: "3", value: 2 },
    { source: "3", target: "1", value: 3 },
  ],
};

async function drawGraph() {
  const { nodes, edges } = testData;

  const svg = d3.select("#graph");
  const width = svg.node().clientWidth;
  const height = svg.node().clientHeight;

  const zoom = d3
    .zoom()
    .scaleExtent([0.1, 5])
    .on("zoom", (event) => {
      svg.selectAll("g").attr("transform", event.transform);
    });

  svg.call(zoom);

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(edges)
        .distance(120)
        .id((d) => d.id)
    )
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg
    .append("g")
    .selectAll("line")
    .data(edges)
    .enter()
    .append("line")
    .attr("stroke", "#999")
    .attr("stroke-width", (d) => Math.sqrt(d.value) || 1);

  const nodeGroup = svg
    .append("g")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g");

  // Add circles for each node
  nodeGroup
    .append("circle")
    .attr("r", (d) => Math.max(20, d.value * 12)) // Dynamically adjust size
    .attr("fill", "#4682B4");

  // Add text inside each node
  nodeGroup
    .append("text")
    .text((d) => d.name)
    .attr("text-anchor", "middle")
    .attr("dy", 4) // Position text vertically centered
    .attr("font-size", (d) => Math.max(8, Math.min(18, d.value * 5))) // Scale text to fit inside circle
    .attr("fill", "#fff");

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    nodeGroup.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
  });
}

drawGraph();
