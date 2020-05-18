function create_corr_graph(color){
    d3.select('svg.chart').remove();
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#Chart")
                .append("svg")
                .attr("class", "chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

    var dataurl = '/get_graph_data';
    d3.json(dataurl, function(data){
        console.log(data);
        /* var links = data.links.map(d => Object.create(d));
        var nodes = data.nodes.map(d => Object.create(d));

        var simulation = d3.forceSimulation(nodes)
                            .force("link", d3.forceLink(links).id(d => d.name))
                            .force("charge", d3.forceManyBody())
                            .force("center", d3.forceCenter(width / 2, height / 2)); */

        var force = d3.layout.force()
                    .linkDistance(60)
                    .charge(-300)
                    .size([width,height]);
        force.nodes(data.nodes)
                    .links(data.links)
                    .start();

        var link = g.selectAll(".link")
                    .data(data.links)
                    .enter().append("line")
                    .attr("class", "link")
                    .style("stroke-width", d => d.value)
                    .style("stroke", "#999" )

        var node = g.selectAll(".node")
                    .data(graph.nodes)
                    .enter().append("g")
                    .attr("class", "node")
                    .call(force.drag);
        /* var link = svg.selectAll("line")
                    .data(links)
                    .enter()
                    .append("line")
                    .attr("stroke", "#999")
                    .attr("stroke-opacity", 0.6)
                    .attr("stroke-width", d => d.value);

        var node = svg.selectAll("circle")
                        .data(nodes)
                        .enter()
                        .append("circle")
                        .attr("r", 5)
                        .attr("stroke", "#fff")
                        .attr("stroke-width", 1.5)
                        .attr("fill", 'black');
        node.append("text")
            .attr('class', 'label')
            .attr('font-size', 'xx-small')
            .text(d => d.name);
        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
            
            node.attr("cx", function(d) {
                if (d.x > width){
                    return width
                }
                if (d.x < 0){
                    return 0;
                }
              })
              .attr("cy", function(d) {
                if (d.y > height){
                    return height
                }
                if (d.y < 0){
                    return 0;
                }
              })
              });
             */
        //invalidation.then(() => simulation.stop());
    });


    function drag(simulation){
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          }
          
          function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          }
          
          function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }
          
          return d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended);
    }
}