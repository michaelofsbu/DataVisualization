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
    var g = svg.append("g");

    var dataurl = '/get_graph_data';
    d3.json(dataurl, function(data){
        console.log(data);

        var links = data.links.map(d => Object.create(d));
        var nodes = data.nodes.map(d => Object.create(d));
        console.log(nodes);

        var simulation = d3.forceSimulation(nodes)
                        .force("link", d3.forceLink(links).id(d => d.id))
                        .force("charge", d3.forceManyBody().strength(200).distanceMax(400).distanceMin(60))
                        .force("center", d3.forceCenter(0, 0));

        var link = g.selectAll('.link')
                    .data(links)
                    .enter().append('line')
                    .attr('class', 'link')
                    .attr("stroke", "#999")
                    .attr("stroke-opacity", 0.6)
                    .attr("x1", d => {return d.source.x + width/2})
                    .attr("y1", d => {return d.source.y + height/2})
                    .attr("x2", d => {return d.target.x + width/2})
                    .attr("y2", d => {return d.target.y + height/2}) 
                    .attr("stroke-width", d => d.value);
                  
        var node = g.selectAll('.node')
                    .data(nodes)
                    .enter().append('circle')
                    .attr('class', 'node')
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 1.5)
                    .attr("r", 5)
                    .attr('cx', d => {return width/2 + d.x})
                    .attr('cy', d => {return height/2 + d.y})
                    .attr("fill", d => color(d.id))
                    .call(drag(simulation));
                  
        node.append("title")
            .text(d => d.id);

       /*  simulation.on("tick", () => {
            link.attr("x1", d => {return d.source.x + width/2})
                .attr("y1", d => {return d.source.y + height/2})
                .attr("x2", d => {return d.target.x + width/2})
                .attr("y2", d => {return d.target.y + height/2});
            node.attr("cx", d => {return d.x + width/2})
                .attr("cy", d => {return d.y + height/2});
              }); */
    });
    function drag(simulation){
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x + width/2;
            d.fy = d.y + height/2;
          }
          
          function dragged(d) {
            d.fx = d3.event.x + width/2;
            d.fy = d3.event.y + height/2;
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