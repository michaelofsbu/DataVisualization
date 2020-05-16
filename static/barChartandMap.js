create_bar_chart();
update_map("all");

function update_map(cat){
  var margin = {top: 80, right: 50, bottom: 80, left: 50},
      width = 960 - margin.left - margin.right,
      height = 720 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#map")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    $.post("get_map_data", {"argument": cat}, function(data_infunc){

      map_data = JSON.parse(data_infunc)

      d3.json("https://raw.githubusercontent.com/YanMa1/CSE564_Final_Project/master/nycbyzipcode.json", function(error, nyc) {
        if (error) throw error;

        var path = d3.geoPath()
          .projection(d3.geoConicConformal()
          .parallels([33, 45])
          .rotate([96, -39])
          .fitSize([width, height], nyc));

        svg.selectAll("path")
          .data(nyc.features)
          .enter().append("path")
          .attr("d", path)
          .style("fill", function(d) {
            var count = 0;
            for (i in map_data){
              if (map_data[i].zip == d.properties.postalCode){
                count = map_data[i].count;
              }
            }
            return d3.interpolateYlGn(count * 0.2);
          })
          .on("mouseenter", function(d) {
            console.log(d);

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
                var count = 0;
                for (i in map_data){
                  if (map_data[i].zip == d.properties.postalCode){
                    count = map_data[i].count;
                  }
                }
                return d3.interpolateYlGn(count * 0.2);
              })
              .style("stroke-dasharray", 1);

          });

    });

  });
}

function create_bar_chart(){
  // set the dimensions and margins of the graph
  var margin = {top: 80, right: 50, bottom: 80, left: 50},
      width = 800 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#barChart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);

  // Define the axes
  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);

  $.post("get_barchart_data", {'data': 'received'}, function(data_infunc){
      data = JSON.parse(data_infunc)

      // Scale the range of the data
      var x_values = data.map(function(d) {return d.industry;});

      x.domain(x_values);
      y.domain([0, d3.max(data, function(d) { return d.count; })]);


      // Add the X Axis
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .style("font-size", "6")
        .style("font-family", "Arial")
        .attr("transform", "rotate(60)")
        .style("text-anchor", "start");

      // Add label to the X Axis
      svg.append("text")
        .attr("class", "x label")
        .attr("transform", "translate(" + (width/2) + "," + (height + margin.top - 5) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "10")
        .style("font-family", "Arial")
        .text("Industry");

      // Add the Y Axis
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      // Add label to the Y Axis
      svg.append("text")
        .attr("class", "y label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "10")
        .style("font-family", "Arial")
        .text("Frequency");

      svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .on("mouseover", function(d) {
          d3.select(this)
            .style("fill", "#afafaf");
        })
        .on("mouseout", function(d) {
          d3.select(this)
            .style("fill", "#56B794");
        })
        .on("click", function(d) {
          d3.select("#map").select("svg").remove();
          update_map(d.industry);
        })
        .attr("x", function(d) { return x(d.industry); })
        .attr("y", function(d) { return x(d.count); })
        .attr("width", x.bandwidth())
        .transition()
        .attr('transform', function(d) { return "translate(0," + y(d.count) + ")"; })
        .ease(d3.easeLinear)
        .attr("height", function(d) { return height - y(d.count); });

      });

}
