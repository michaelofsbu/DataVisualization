//create_stack_chart();
function create_stack_chart(color){
    d3.select('svg.chart').remove();
    // set the dimensions and margins of the graph
    var margin = {top: 150, right: 50, bottom: 30, left: 50},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#Chart")
                .append("svg")
                .attr("class", "chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

    // Make title
    svg.append('text')
    .attr("class", "title")
    .attr("transform", "translate(" + (width+margin.left)/2 + "," + margin.top + ")")
    .style("text-anchor", "middle")
    .style("font-size", "10")
    .style("font-family", "Arial")
    .text("Population of Active Indusries (01/2000 - 05/2020)");
    // create buttons for choosing license type
    var license_type = ["Business", "Individual"];
    var usr_choice;
    // Add one dot in the button for each name.
    var button = svg.selectAll("button")
                    .data(license_type)
                    .enter()
                    .append('circle')
                    .attr('class', 'button')
                    .attr('cx', (d,i) => 30 + i*100)
                    .attr('cy', 20)
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
                          .attr("x", (d, i) => 40 + + i*100)
                          .attr("y", 25)
                          .text(function(d){ return d})
                          .attr("text-anchor", "left")
                          .attr("font-family", "Arial");
    plot('Business', color);
    function choose_license_type(d){
        usr_choice=d;
        d3.select('svg.chart').selectAll('circle').attr('class', 'button');
        d3.select(this).attr('class', 'button_clicked');
        plot(usr_choice, color);
    }

    function plot(license_type, color){
        d3.select('svg.chart').selectAll('g').remove();
        d3.select('svg.chart').selectAll('.legend').remove();
        d3.select('svg.chart').selectAll('.legend_label').remove();

        var dataurl = '/get_stackchart_data/' + license_type;

        d3.json(dataurl, function(data){
        var group = Object.keys(data[0]).filter((item)=> item!=='Date');
        update_map(group);

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
                       .call(d3.axisBottom(x).ticks(width / 60)
                       .tickSizeOuter(0));
        var y = d3.scaleLinear()
                  .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
                  .range([height, 0]);
        var yaxis = svg.append("g")
                       .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                       .attr('class', 'axis')
                       .transition()
                       .ease(d3.easeLinear)
                       .duration(400)
                       .delay((d, i) => i*50)
                       .call(d3.axisLeft(y));
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

         // Add color legend
    var w = 130, h = 20;
    svg.selectAll("legend")
        .data(group)
        .enter()
        .append("rect")
        .attr("x", (d, i) => {return 30 + w * (i % 6)})
        .attr("y", (d,i) => {return 35 + Math.floor(i / 6) * (h)})
        .attr('class', 'legend')
        .attr("width", w)
        .attr("height", h)
        .style("fill", function(d){ return color(d)})
        .style("cursor", "pointer")
        .on("mouseover", highlight)
        .on("mouseout", noHighlight)
        .on('click', update_stack_chart);
    // add legend label
    svg.selectAll("legend_label")
        .data(group)
        .enter()
        .append("text")
        .attr("x", (d, i) => {return 30 + w * (i % 6)})
        .attr("y", (d,i) => {return 35 + Math.floor(i / 6) * (h) + 0.5*h})
        .attr('class', "legend_label")
        .style("fill", 'black')
        .style('font-size', 'x-small')
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("cursor", "pointer")
        .on('click', update_stack_chart);

        function update_stack_chart(k){
            var cat = [k];
            update_map(cat);
            var select_data = [];
            for (i in data){
                temp = {};
                temp[k] = data[i][k];
                temp['Date'] = data[i]['Date']
                select_data.push(temp);
            }
            d3.select('svg.chart').selectAll('g.axis').remove();
            d3.select('svg.chart').selectAll('path').remove();
            d3.select('svg.chart').select('text.title').remove();
            // Make new title
            svg.append('text')
                .attr("class", "title")
                .attr("transform", "translate(" + (width+margin.left)/2 + "," + margin.top + ")")
                .style("text-anchor", "middle")
                .style("font-size", "10")
                .style("font-family", "Arial")
                .text(k + " (01/2000 - 05/2020)");
            // add X and Y axises
            x = d3.scaleTime()
                .domain(d3.extent(select_data, function(d) { return new Date(d.Date); }))
                .range([0, width]);
            xaxis = svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + (height+margin.top) + ")")
                    .attr('class', 'axis')
                    .call(d3.axisBottom(x).ticks(width / 60)
                    .tickSizeOuter(0));
            y = d3.scaleLinear()
                .domain([0, d3.max(select_data, d => d[k])])
                .range([height, 0]);
            yaxis = svg.append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
             .attr('class', 'axis')
             .transition()
             .ease(d3.easeLinear)
             .duration(400)
             .delay((d, i) => i*50)
             .call(d3.axisLeft(y));

            plot.append("path")
                .datum(select_data)
                .attr("fill", color(k))
                .style("cursor", "pointer")
               .on('click', restore)
                .transition()
                .ease(d3.easeLinear)
                .duration(400)
                .delay((d, i) => i*50)
                .attr("d", d3.area()
               .x(function(d) { return x(new Date(d.Date)) })
               .y0(y(0))
               .y1(function(d) { console.log(y(d[k])); return y(d[k]) })
               );

        }
        function restore(){
            update_map(group);
            d3.select('svg.chart').selectAll('g.axis').remove();
            d3.select('svg.chart').selectAll('path').remove();
            d3.select('svg.chart').select('text.title').remove();
        // Make title
        svg.append('text')
            .attr("class", "title")
            .attr("transform", "translate(" + (width+margin.left)/2 + "," + margin.top + ")")
            .style("text-anchor", "middle")
            .style("font-size", "10")
            .style("font-family", "Arial")
            .text("Population of Active Indusries (01/2000 - 05/2020)");

        // add X and Y axises
        var x = d3.scaleTime()
                .domain(d3.extent(data, function(d) { return new Date(d.Date); }))
                .range([0, width]);
        var xaxis = svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + (height+margin.top) + ")")
                    .attr('class', 'axis')
                    .call(d3.axisBottom(x).ticks(width / 60)
                    .tickSizeOuter(0));
        var y = d3.scaleLinear()
                .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
                .range([height, 0]);
        var yaxis = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr('class', 'axis')
                .transition()
                .ease(d3.easeLinear)
                .duration(400)
                .delay((d, i) => i*50)
                .call(d3.axisLeft(y));
        // plot area
        var plot = svg.append("g")
                    .attr("transform","translate(" + margin.left + "," + margin.top + ")");
        stack = plot.selectAll("path")
            .data(series)
            .enter()
            .append("path")
            .style("fill", function(d) { return color(d.key); })
            .attr("class", function(d) {return "myArea " + d.key})
            .attr("d", d3.area().x(function(d, i) { return x(new Date(d.data.Date)); })
            .y0(function(d) { return y(d[0]); })
            .y1(function(d) { return y(d[1]); }));
        }

        function highlight(k){
            //console.log(k)
            // reduce opacity of all groups
            //d3.select('svg.chart').selectAll("path").transition().ease(d3.easeLinear).style("opacity", .1);
            // expect the one that is hovered
            stack.filter((d) => d.key != k).transition()
            .ease(d3.easeLinear).style("opacity", .1);
            }


        // when it is not hovered anymore
        function noHighlight(){
            d3.select('svg.chart').selectAll("path").style("opacity", 1)
            };
        })
    }

}
