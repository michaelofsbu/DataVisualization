create_stack_chart();
function create_stack_chart(){
    // set the dimensions and margins of the graph
    var margin = {top: 80, right: 400, bottom: 50, left: 50},
        width = 1264 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#stackChart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

    // create buttons for choosing license type
    var license_type = ["Business", "Individual"];
    var usr_choice;
    // Add one dot in the button for each name.   
    var button = svg.selectAll("button")
                    .data(license_type)
                    .enter()
                    .append('circle')
                    .attr('class', 'button')
                    .attr('cx', 30)
                    .attr('cy', function(d,i){ return 20 + i*30})
                    .attr('r', 5)
                    .each(function(d){if (d == 'Business'){d3.select(this).attr('class', 'button_clicked')}})
                    .on('mouseover', function(){d3.select(this).transition().duration(100).attr('r', 7);})
                    .on('mouseout', function(){d3.select(this).transition().duration(100).attr('r', 5);})
                    .on('click', choose_license_type);
    var button_label = svg.selectAll("button_label")
                          .data(license_type)
                          .enter()
                          .append("text")
                          .attr('class', 'button_label')
                          .attr("x", 40)
                          .attr("y", function(d,i){ return 25 + i*30})
                          .text(function(d){ return d})
                          .attr("text-anchor", "left");  
    plot('Business');
    function choose_license_type(d){
        usr_choice=d; 
        d3.selectAll('circle').attr('class', 'button'); 
        d3.select(this).attr('class', 'button_clicked');
        plot(usr_choice);
    }

    function plot(license_type){
        d3.select('svg').selectAll('g').remove();
        d3.select('svg').selectAll('.legend').remove();
        d3.select('svg').selectAll('.legend_label').remove();

        var dataurl = '/get_stackchart_data/' + license_type;

        d3.json(dataurl, function(data){
        var group = Object.keys(data[0]).filter((item)=> item!=='Date');

        // compute stack area
        var series = d3.stack()
                        .keys(group)(data);

        // add X and Y axises
        var x = d3.scaleTime()
                  .domain(d3.extent(data, function(d) { return new Date(d.Date); }))
                .range([0, width]);
        var xaxis = svg.append("g")
                       .attr("transform", "translate(" + margin.left + "," + (height+margin.top) + ")")
                       .attr('class', 'axis')
                       .call(d3.axisBottom(x).ticks(width / 80)
                       .tickSizeOuter(0));
        var y = d3.scaleLinear()
                  .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
                  .range([height, 0]);
        var yaxis = svg.append("g")
                       .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                       .attr('class', 'axis')
                       .call(d3.axisLeft(y));

        // define color scheme
        var color = d3.scaleOrdinal()
                       .domain(group)
                       .range(d3.schemeSet2);
        // plot area
        var plot = svg.append("g")
                      .attr("transform","translate(" + margin.left + "," + margin.top + ")");
        var stack = plot.selectAll("path")
           .data(series)
           .enter()
           .append("path")
           .style("fill", function(d) { return color(d.key); })
           .attr("class", function(d) {return "myArea " + d.key})
           .attr("d", d3.area().x(function(d, i) { return x(new Date(d.data.Date)); })
                               .y0(function(d) { return y(d[0]); })
                               .y1(function(d) { return y(d[1]); }));
        
        // add legend
        var size = 10;
        svg.selectAll("legend")
            .data(group)
            .enter()
            .append("rect")
            .attr("x", (d, i) => {return width + margin.left + 10 + 120 * Math.floor(i/12)})
            .attr("y", (d,i) => {return 20 + (i % 12) * (size + 20)}) 
            .attr('class', 'legend')
            .attr("width", size)
            .attr("height", size)
            .style("fill", function(d){ return color(d)})
            .on("mouseover", highlight)
            .on("mouseout", noHighlight);
        // add legend label
        svg.selectAll("legend_label")
            .data(group)
            .enter()
            .append("text")
            .attr("x", (d, i) => {return width + margin.left + 10 + 120 * Math.floor(i/12)})
            .attr("y", (d,i) => {return 20 + (i % 12) * (size + 20) + 1.7*size})
            .attr('class', "legend_label")
            .style("fill", function(d){ return color(d)})
            .style('font-size', 'xx-small')
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .on("mouseover", highlight)
            .on("mouseout", noHighlight);
        
        function highlight(k){
            console.log(k)
            // reduce opacity of all groups
            d3.select('svg').selectAll("path").style("opacity", .1)
            // expect the one that is hovered
            stack.filter((d) => d.key == k).style("opacity", 1)
            };
          
        // when it is not hovered anymore
        function noHighlight(){
            d3.select('svg').selectAll("path").style("opacity", 1)
            };
        })
    }

}