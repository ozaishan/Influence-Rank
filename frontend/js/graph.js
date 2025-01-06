

async function drawGraph() {
  const response = await fetch('http://localhost:5000/api/graph-data');
  const { nodes, edges } = await response.json();

  const svg = d3.select('#graph');
  const width = svg.node().clientWidth;
  const height = svg.node().clientHeight;

  // Add zoom functionality
  const zoom = d3.zoom()
    .scaleExtent([0.1, 5])  // Allow zooming in and out
    .on('zoom', (event) => {
      svg.selectAll('g').attr('transform', event.transform);  // Apply zoom to entire graph
    });

  svg.call(zoom);

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(edges).distance(100).id(d => d.id))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = svg.append('g')
    .selectAll('line')
    .data(edges)
    .enter()
    .append('line')
    .attr('stroke', '#999')
    .attr('stroke-width', 1);

  const nodeGroup = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', d => Math.max(5, d.value * 20))  // Radius based on 'value'
    .attr('fill', d => getColor(d))  // Assign color based on influencer 'id'
    .call(d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded));

  nodeGroup.append('title').text(d => d.label);  // Tooltip for the node

  const textGroup = svg.append('g')
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('text-anchor', 'middle')
    .attr('font-size', 10)
    .attr('dy', -20)  // Adjust y-position of the text above the node
    .text(d => d.label);

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    nodeGroup
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    textGroup
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  });

  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  function getColor(d) {
    const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#8A2BE2'];
    return colors[d.id.length % colors.length];  // Assign color based on 'id' length
  }
}

drawGraph();
