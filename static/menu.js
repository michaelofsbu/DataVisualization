create_menu();
function create_menu(){
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = 500 - margin.left - margin.right,
      height = 90 - margin.top - margin.bottom;

    var industry_name = ['Amusement', 'Car Wash', 'Dealer In Products', 'Debt Collection Agency',
                        'Electronic & Appliance Service', 'Electronic Cigarette Dealer',
                        'Electronics Store', 'Employment Agency', 'Garage and Parking Lot',
                        'General Vendor', 'Home Improvement Contractor', 'Home Improvement Salesperson',
                        'Horse Drawn Driver', 'Laundry', 'Locksmith', 'Motion Picture Projectionist',
                        'Pawnbroker', 'Pedicab Business', 'Pedicab Driver', 'Process Server Individual',
                        'Process Serving Agency', 'Secondhand Dealer', 'Sidewalk Cafe', 'Sightseeing Guide',
                        'Special Sale', 'Stoop Line Stand', 'Ticket Seller', 'Tobacco Retail Dealer',
                        'Tow Truck', 'Tow Truck Driver'];
    var color = d3.scaleOrdinal()
                .domain(industry_name)
                .range(d3.schemeSet3);

    // append the svg object to the body of the page
    var Menu = d3.select("#menu")
      .append("svg")
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'Menu')
      //.append('g')
      //.attr("transform","translate(" + margin.left + "," + margin.top + ")");

    var menuName = ['Bar Chart', 'Stack Area Chart', 'Correlation Graph'];
    // Add one dot in the button for each name.
    var button = Menu.selectAll("menu")
                    .data(menuName)
                    .enter()
                    .append('circle')
                    .attr('class', 'menu')
                    .attr('cy', height/2)
                    .attr('cx', function(d,i){ return 30 + i*150})
                    .attr('r', 10)
                    .each(function(d){if (d == 'Bar Chart'){d3.select(this).attr('class', 'menu_choosed')}})
                    .on('mouseover', function(){d3.select(this).transition().duration(100).attr('r', 15);})
                    .on('mouseout', function(){d3.select(this).transition().duration(100).attr('r', 10);})
                    .on('click', draw);
    var button_label = Menu.selectAll("button_label")
                          .data(menuName)
                          .enter()
                          .append("text")
                          .attr('class', 'menu_label')
                          .attr("y", height/2 + 5)
                          .attr("x", function(d,i){ return 45 + i*150})
                          .text(function(d){ return d})
                          .attr("text-anchor", "left")
                          .attr("font-family", "Arial");
/*     // Add color legend
    var w = 130, h = 20;
    Menu.selectAll("legend")
        .data(industry_name)
        .enter()
        .append("rect")
        .attr("x", (d, i) => {return 30 + w * (i % 6)})
        .attr("y", (d,i) => {return margin.top + Math.floor(i / 6) * (h)})
        .attr('class', 'legend')
        .attr("width", w)
        .attr("height", h)
        .style("fill", function(d){ return color(d)})
        .on("mouseover", highlight)
        .on("mouseout", null);
    // add legend label
    Menu.selectAll("legend_label")
        .data(industry_name)
        .enter()
        .append("text")
        .attr("x", (d, i) => {return 30 + w * (i % 6)})
        .attr("y", (d,i) => {return margin.top + Math.floor(i / 6) * (h) + 0.5*h})
        .attr('class', "legend_label")
        //.style("fill", function(d){ return 'white'})
        .style('font-size', 'x-small')
        .text(function(d){ return d})
        .attr("text-anchor", "left"); */
    update_bar_chart(color);
    function draw(d){
        console.log(d);
        d3.select('svg.Menu').selectAll('circle').attr('class', 'menu');
        d3.select(this).attr('class', 'menu_choosed');
        if (d == 'Bar Chart'){
            update_bar_chart(color);
        }
        else if (d == 'Stack Area Chart'){
            create_stack_chart(color);
        }
        else if (d == 'Correlation Graph'){
            create_corr_graph(color);
        }
    }

}
