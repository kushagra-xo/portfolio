const data = {
  nodes: [
    { id: "Computers", group: 1 },
    { id: "Programming", group: 2 },
    { id: "Administration", group: 3 },
    { id: "Security", group: 4 },
  ],
  links: [
    { source: "Programming", target: "Computers" },
    { source: "Administration", target: "Computers" },
    { source: "Security", target: "Computers" },
  ],
};

function getWindowDimensions() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function createGraph() {
  const { width, height } = getWindowDimensions();

  d3.select("#graph-container").selectAll("svg").remove(); // Clear existing SVGs

  const svg = d3
    .select("#graph-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Calculate node degrees
  const degreeMap = new Map();
  data.nodes.forEach((node) => {
    degreeMap.set(node.id, 0);
  });
  data.links.forEach((link) => {
    degreeMap.set(link.source, degreeMap.get(link.source) + 1);
    degreeMap.set(link.target, degreeMap.get(link.target) + 1);
  });

  const links = data.links.map((d) => ({ ...d }));
  const nodes = data.nodes.map((d) => ({ ...d, degree: degreeMap.get(d.id) }));

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(150)
    )
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", 2);

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", (d) => 5 + d.degree * 2) // Size based on degree
    .attr("fill", "white")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  const labels = svg
    .append("g")
    .selectAll("text")
    .data(nodes)
    .join("text")
    .attr("class", "label")
    .attr("dy", 30) // Position labels below nodes
    .attr("fill", "white")
    .text((d) => d.id);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    labels
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("dx", 0); // Center labels horizontally
  });

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

createGraph();

window.addEventListener("resize", createGraph); // Redraw on resize
