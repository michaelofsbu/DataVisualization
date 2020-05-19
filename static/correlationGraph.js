function create_corr_graph(color){
    d3.select('svg.chart').remove();
    var margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#Chart")
                .append("svg")
                .attr("class", "chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);
    var g = svg.append("g")
               .attr('transform', "translate(" + margin.left + "," + margin.top + ")")

    var dataurl = '/get_graph_data';
    d3.json(dataurl, function(data){
        console.log(data);

        var links = data.links;//.map(d => Object.create(d));
        var nodes = data.nodes;//.map(d => Object.create(d));
        console.log(nodes);
        console.log(links);
        s = d3.scaleLinear().range([1, 10]).domain([0.85, 1]);

        var simulation = d3.forceSimulation(nodes)
                        .force("link", d3.forceLink(links).id(d => d.id))
                        .force("charge", d3.forceManyBody().strength(-50).distanceMax(200).distanceMin(100))
                        .force("center", d3.forceCenter(width/2, height/2));

        var link = g.selectAll('.link')
                    .data(links)
                    .enter().append('line')
                    .attr('class', 'link')
                    .attr("stroke", "#999")
                    .attr("stroke-opacity", 1)
                    .attr("x1", d => {return d.source.x + width/2})
                    .attr("y1", d => {return d.source.y + height/2})
                    .attr("x2", d => {return d.target.x + width/2})
                    .attr("y2", d => {return d.target.y + height/2}) 
                    .attr("stroke-width", d => s(d.value));
        var node_r = 15;          
        var node = g.selectAll('.node')
                    .data(nodes)
                    .enter().append('circle')
                    .attr('class', 'node')
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 1.5)
                    .attr("r", node_r)
                    .attr('cx', d => {return d.x})
                    .attr('cy', d => {return d.y})
                    .attr("fill", d => color(d.id))
                    .call(drag(simulation))
                    .style("cursor", "pointer")
                    .on("mouseover", highlight)
                    .on("mouseout", nohightlight)
                    .on('click', chooseMap);

        node.append("title")
            .text(d => d.id);

        var text = g.selectAll(".text")
            .data(nodes)
            .enter().append("text")
            .attr("x", d => d.x + node_r)
            .attr("y", d => d.y + node_r/2)
            .style("font-size", 'xx-small')
            .style("font-family", "Arial")
            .text(d => d.id)
            .call(drag(simulation));

        function chooseMap(d){
            var type = [];
            type.push(d.id);
            for (l in links){
                if(links[l].source.id == d.id){
                    type.push(links[l].target.id)
                }
            }
            update_map(type);
        }
        function highlight(k){
            var neighbor = [];
            neighbor.push(k.id);
            for (l in links){
                if(links[l].source.id == k.id){
                    neighbor.push(links[l].target.id)
                }
            }

            node.filter(d => !neighbor.includes(d.id))
                .style('opacity', .1)
            link.filter(d => (d.source.id != k.id))
                .style('opacity', .1)
            text.filter(d => neighbor.includes(d.id))
                .style('font-size', 'medium')
            text.filter(d => !neighbor.includes(d.id))
                .style('opacity', .1)
        }
    
        function nohightlight(d){
                node.style("opacity", 1);
                link.style("opacity", 1);
                text.style('font-size', 'xx-small')
                    .style('opacity', 1);

        }

        simulation.on("tick", () => {
            link.attr("x1", d => {return Math.max(0, Math.min(d.source.x, width))})
                .attr("y1", d => {return Math.max(0, Math.min(d.source.y, height))})
                .attr("x2", d => {return  Math.max(0, Math.min(d.target.x, width))})
                .attr("y2", d => {return Math.max(0, Math.min(d.target.y, height))});
            node.attr("cx", d => {return Math.max(0, Math.min(d.x, width)) })
                .attr("cy", d => {return Math.max(0, Math.min(d.y, height))});
            text.attr("x", d => {return Math.max(0, Math.min(d.x + node_r, width))})
                .attr("y", d => {return Math.max(0, Math.min(d.y + node_r/2, height))});
              });
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
