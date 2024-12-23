async function drawGraph() {
    const response = await fetch('​http://localhost:5000/api/graph-data');
    const { nodes, edges } = await response.json();
  
    const svg = d3.select('#graph');
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
  
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
  
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', d => Math.max(5, d.value * 20))
      .attr('fill', '#69b3a2')
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));
  
    node.append('title').text(d => d.label);
  
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
  
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
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
  }
  
  drawGraph();
  