function update_bar_chart(color){
    d3.select('svg.chart').remove()
    // set the dimensions and margins of the graph
    var margin = {top: 150, right: 50, bottom: 10, left: 50},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
  
    // append the svg object to the body of the page
    var svg = d3.select("#Chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        //.attr("transform", "translate(" + 400 + "," + 0 + ")")
        .attr('class', 'chart');
    var barChart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    var x = d3.scaleBand().range([0, width]).padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);
  
    // Define the axes
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);
  
    d3.json("get_barchart_data", function(data_infunc) {
        data = JSON.parse(data_infunc)
        // Add color legend
    var w = 130, h = 20;
    var legend = svg.selectAll("legend")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => {return 30 + w * (i % 6)})
        .attr("y", (d,i) => {return 10 + Math.floor(i / 6) * (h)}) 
        .attr('class', 'legend')
        .attr("width", w)
        .attr("height", h)
        .style("fill", function(d){ return color(d.industry)})
        .style("cursor", "pointer")
        .on("mouseover", highlight)
        .on("mouseout", noHighlight)
        .on("click", function(d) {
            update_map(d.industry);
          });
    // add legend label
    svg.selectAll("legend_label")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d, i) => {return 30 + w * (i % 6)})
        .attr("y", (d,i) => {return 10 + Math.floor(i / 6) * (h) + 0.5*h})
        .attr('class', "legend_label")
        .style("fill", 'black')
        .style('font-size', 'x-small')
        .text(function(d){ return d.industry})
        .attr("text-anchor", "left")
        .style("cursor", "pointer")
        .on("click", function(d) {
            d3.select("#map").select("svg").remove();
            update_map(d.industry);
          });

        data = data.sort((a, b) => (a.count < b.count) ? 1 : -1);
        // Scale the range of the data
        var x_values = data.map(function(d) {return d.industry;});
  
        x.domain(x_values);
        y.domain([0, d3.max(data, function(d) { return d.count; })]);
  
        // Add the X Axis
        barChart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
          .attr('opacity', 0);
          /* .attr("y", 0)
          .attr("x", 9)
          .attr("dy", ".35em")
          .style("font-size", "6")
          .style("font-family", "Arial")
          .attr("transform", "rotate(60)")
          .style("text-anchor", "start"); */
  
        // Add the Y Axis
        barChart.append("g")
          .attr("class", "y axis")
          .call(yAxis);
        
        // Add title
        barChart.append("text")
        .attr("class", "title")
        .attr("transform", "translate(" + (width/2) + "," + 0 + ")")
        .style("text-anchor", "middle")
        .style("font-size", "10")
        .style("font-family", "Arial")
        .text("Population of Different Industry Type");
  
        var Bar = barChart.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr('fill', (d) => color(d.industry))
          .on("mouseover", highlight_bar)
          .on("mouseout", noHighlight_bar)
          .on("click", function(d) {
            update_map(d.industry);
          })
          .style("cursor", "pointer")
          .attr("x", function(d) { return x(d.industry); })
          .attr("y", function(d) { return y(d.count); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d.count); });

        function highlight_bar(d){
            d3.select('svg.chart').selectAll(".bar").style("opacity", .1)
            d3.select(this)
             .style('opacity', 1)
              .attr("height", function(d) { return height - y(d.count) + 5; })
              .attr("width", x.bandwidth()+5)
              .attr("x", function(d) { return x(d.industry)-2.5; })
              .attr("y", function(d) { return y(d.count) - 5; });
            d3.select('svg.chart').selectAll(".legend").style("opacity", .1);
            legend.filter((k) => k.industry == d.industry).transition()
              .ease(d3.easeLinear).style("opacity", 1);
            barChart.append('text')
              .attr('class', 'val') 
              .attr('x', () => x(d.industry) - 2.5 + x.bandwidth()/2)
              .attr('y', () => y(d.count) - 7)
              .text(() => d.count)
              .attr("text-anchor", "middle");
        }

        function noHighlight_bar(d){
            d3.select('svg.chart').selectAll(".bar").style("opacity", 1)
            d3.select(this)
              .attr("width", x.bandwidth())
              .attr("height", function(d) { return height - y(d.count); })
              .attr("x", function(d) { return x(d.industry); })
              .attr("y", function(d) { return y(d.count); });
            d3.select('svg.chart').selectAll(".legend").style("opacity", 1);
            d3.select('svg.chart').selectAll('text.val').remove();
        }

        function highlight(k){
            console.log(k)
            // reduce opacity of all groups
            //d3.select('svg.chart').selectAll("path").transition().ease(d3.easeLinear).style("opacity", .1);
            // expect the one that is hovered
            d3.select('svg.chart').selectAll(".bar").style("opacity", .1)
            Bar.filter((d) => d.industry == k.industry).transition()
            .ease(d3.easeLinear)
            .style("opacity", 1)
            .attr("height", function(d) { return height - y(d.count) + 5; })
              .attr("width", x.bandwidth()+5)
              .attr("x", function(d) { return x(d.industry)-2.5; })
              .attr("y", function(d) { return y(d.count) - 5; });
            barChart.append('text')
              .attr('class', 'val') 
              .attr('x', () => x(k.industry) - 2.5 + x.bandwidth()/2)
              .attr('y', () => y(k.count) - 7)
              .text(() => k.count)
              .attr("text-anchor", "middle");
            }
          
        // when it is not hovered anymore
        function noHighlight(){
            d3.select('svg.chart')
                .selectAll(".bar")
                .style("opacity", 1)
                .attr("width", x.bandwidth())
              .attr("height", function(d) { return height - y(d.count); })
              .attr("x", function(d) { return x(d.industry); })
              .attr("y", function(d) { return y(d.count); });
            d3.select('svg.chart').selectAll('text.val').remove();
            };
  
        });
}
  