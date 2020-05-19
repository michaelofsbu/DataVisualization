//update_bar_chart();
update_map("all");

function update_map(cat){
  d3.select("#map").select("svg").remove();
  var margin = {top: 50, right: 100, bottom: 0, left: 50},
      width = 400 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var Map = d3.select("#map")
      .append("svg")
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'Map')
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  Map.append("text")
      .attr("x", (width/2))
      .attr("y", (0 - 20))
      .attr("text-anchor", "middle")
      .style("font-size", "16")
      .style("font-family", "Arial")
      .style("text-decoration", "capitalize")
      .style("font-weight", "bold")
      .text("Industry Distribution in NYC");

  var url = "get_map_data/" + cat;
  d3.json(url, function(data_infunc) {
    map_data = JSON.parse(data_infunc)
    console.log(map_data);
    d3.json("https://raw.githubusercontent.com/YanMa1/CSE564_Final_Project/master/nycbyzipcode.json", function(error, nyc) {
      if (error) throw error;

      var path = d3.geoPath()
        .projection(d3.geoConicConformal()
        .parallels([33, 45])
        .rotate([96, -39])
        .fitSize([width, height], nyc));

        Map.selectAll("path")
        .data(nyc.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) {
          var max = 0;
          var count = 0;
          for (i in map_data){
            if (map_data[i].count > max){
              max = map_data[i].count;
            }
            if (map_data[i].zip == d.properties.postalCode){
              count = map_data[i].count;
            }
          }
          delta = max / 5;
          if(count == 0){
              return d3.interpolateYlGn(0);
          }else if(count < delta){
              return d3.interpolateYlGn(0.2);
          }else if(count < delta * 2){
            return d3.interpolateYlGn(0.4);
          }else if(count < delta * 3){
            return d3.interpolateYlGn(0.6);
          }else if(count < delta * 4){
            return d3.interpolateYlGn(0.8);
          }else{
            return d3.interpolateYlGn(1);
          }
        })
        .on("mouseenter", function(d) {
          //console.log(d);

          d3.select(this)
            .style("stroke-width", 1.5)
            .style("fill", "#afafaf")
            .style("stroke-dasharray", 0);

          d3.select("#zipcodePopover")
            .transition()
            .style("opacity", 1)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px")
            .text(d.properties.PO_NAME);
        })
        .on("mouseleave", function(d) {
          d3.select(this)
            .style("stroke-width", .25)
            .style("fill", function(d) {
              var max = 0;
              var count = 0;
              for (i in map_data){
                if (map_data[i].count > max){
                  max = map_data[i].count;
                }
                if (map_data[i].zip == d.properties.postalCode){
                  count = map_data[i].count;
                }
              }
              delta = max / 5;
              if(count == 0){
                  return d3.interpolateYlGn(0);
              }else if(count < delta){
                  return d3.interpolateYlGn(0.2);
              }else if(count < delta * 2){
                return d3.interpolateYlGn(0.4);
              }else if(count < delta * 3){
                return d3.interpolateYlGn(0.6);
              }else if(count < delta * 4){
                return d3.interpolateYlGn(0.8);
              }else{
                return d3.interpolateYlGn(1);
              }
            })
            .style("stroke-dasharray", 1);
          d3.select('#zipcodePopover')
            .style("opacity", 0)
            .text(null);
        });

      // Color legend.
      range = [d3.interpolateYlGn(0), d3.interpolateYlGn(1)];
      var colorScale = d3.scaleLinear()
        .domain([0, d3.max(map_data, function(d) { return d.count/100; })])
        .range(range);

      var colorLegend = d3.legendColor()
        .labelFormat(d3.format(".02%"))
        .scale(colorScale)
        .cells(5)
        .shapePadding(2)
        .shapeWidth(10)
        .shapeHeight(10)
        .labelOffset(2)
        .labelDelimiter("~");


        Map.append("g")
        .attr("transform", "translate(250, 10)")
        .call(colorLegend)
        .selectAll("text")
        .style("font-size", "small")
        .style("font-family", "Arial");
    });

  });
}
