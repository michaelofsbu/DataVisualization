create_stack_chart();
function create_stack_chart(){
    // set the dimensions and margins of the graph
    var margin = {top: 80, right: 230, bottom: 50, left: 50},
        width = 800 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

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
                    .on('mouseover', function(){d3.select(this).transition().duration(100).attr('r', 7);})
                    .on('mouseout', function(){d3.select(this).transition().duration(100).attr('r', 5);})
                    .on('click', choose_license_type)
    d3.selectAll('button').each(function(){console.log(this.data)})
    var button_label = svg.selectAll("button_label")
                          .data(license_type)
                          .enter()
                          .append("text")
                          .attr('class', 'button_label')
                          .attr("x", 40)
                          .attr("y", function(d,i){ return 25 + i*30})
                          .text(function(d){ return d})
                          .attr("text-anchor", "left");  
    
    function choose_license_type(d){
        usr_choice=d; 
        d3.selectAll('circle').attr('class', 'button'); 
        d3.select(this).attr('class', 'button_clicked');
        console.log(this.data);
        plot(usr_choice);
    }

    function plot(license_type){
        d3.select('svg').selectAll('g').remove();
        var plot = svg.append("g")
                      .attr("transform","translate(" + margin.left + "," + margin.top + ")");
    }

}