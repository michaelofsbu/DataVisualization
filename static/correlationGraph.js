function create_corr_graph(color){
    d3.select('svg.chart').remove();
    var margin = {top: 100, right: 10, bottom: 10, left: 10},
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

        var simulation = d3.forceSimulation(nodes)
                        .force("link", d3.forceLink(links).id(d => d.id))
                        .force("charge", d3.forceManyBody().strength(-10).distanceMax(100).distanceMin(60))
                        .force("center", d3.forceCenter(width/2, height/2));

        var link = g.selectAll('.link')
                    .data(links)
                    .enter().append('line')
                    .attr('class', 'link')
                    .attr("stroke", "#999")
                    .attr("stroke-opacity", d =>  d.value)
                    .attr("x1", d => {return d.source.x + width/2})
                    .attr("y1", d => {return d.source.y + height/2})
                    .attr("x2", d => {return d.target.x + width/2})
                    .attr("y2", d => {return d.target.y + height/2}) 
                    .attr("stroke-width", d => Math.sqrt(Math.exp(d.value*10)/1000));
                  
        var node = g.selectAll('.node')
                    .data(nodes)
                    .enter().append('circle')
                    .attr('class', 'node')
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 1.5)
                    .attr("r", 10)
                    .attr('cx', d => {return d.x})
                    .attr('cy', d => {return d.y})
                    .attr("fill", d => color(d.id))
                    .call(drag(simulation))
                    .on("click", d => {
                      var cat = [d.id];
                      update_map(cat);
                      node.style("opacity", function(o){
                        var connected = 0;
                        for (l in links){
                          if((links[l].source == o && links[l].target == d) || (links[l].source == d && links[l].target == o) || d == o){
                            connected = 1;
                          }
                        }
                        if (connected == 1){
                          return 1;
                        }else{
                          return 0.2;
                        }
                      });
                      link.style("opacity", function(o){
                        if (o.source == d || o.target == d){
                          return 1
                        }else{
                          return 0.2;
                        }
                      })
                    })
                    .on("mouseout", d => {
                      node.style("opacity", function(o){
                        return 1;
                      });
                      link.style("opacity", function(o){
                        return 1;
                      })
                    });

        node.append("title")
            .text(d => d.id);

        simulation.on("tick", () => {
            link.attr("x1", d => {return Math.max(0, Math.min(d.source.x, width))})
                .attr("y1", d => {return Math.max(0, Math.min(d.source.y, height))})
                .attr("x2", d => {return  Math.max(0, Math.min(d.target.x, width))})
                .attr("y2", d => {return Math.max(0, Math.min(d.target.y, height))});
            node.attr("cx", d => {return Math.max(0, Math.min(d.x, width)) })
                .attr("cy", d => {return Math.max(0, Math.min(d.y, height))});
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
