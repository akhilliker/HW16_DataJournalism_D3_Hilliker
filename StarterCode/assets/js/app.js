// Define svg area and margins
var svgWidth = 500;
var svgHeight = 400;

var margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
};

// Chart dimensions
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Append chart
var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

console.log("chart appended");

// load in data from csv and force data to number in case they are stored as strings
d3.csv("assets/data/data.csv").then(function(riskData, error) {
    if (error) throw error;
    riskData.forEach(function(data){
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    })
    console.log("csv read");

    // Create x (poverty) and y (obesity) scale, create axes
    var xScale = d3.scaleLinear()
                    .domain([5, d3.max(riskData, data => data.poverty)])
                    .range([0,chartWidth]);

    var yScale = d3.scaleLinear()
                    .domain([d3.min(riskData, data => data.obesity), d3.max(riskData, data => data.obesity)+ 10])
                    .range([chartHeight, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale)
                .ticks(5);

    // Create circles mapped to x, y coordinates for data points
    svg.selectAll("circle")
        .data(riskData)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return xScale(d.poverty)
        })
        .attr("cy", function(d) {
            return yScale(d.obesity)
        })
        .attr("r", 10)
        .attr("stroke", "grey")
        .attr("stroke-width", 2)
        .attr("fill", "blue");
    svg.selectAll("text")
        .data(riskData)
        .enter()    
        .append("text")
            .text((d) => (d.abbr))
            .attr("x", function(d) {
                return xScale(d.poverty-0.25)
            })
            .attr("y", function(d) {
                return yScale(d.obesity-0.35)
            })
            .style("fill", "white")
            .style("font-size", "8px");

    // append axis lines and styling
    var padding = 20;

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.bottom})`);

    chartGroup.append("g")
        .attr("class", "axis")
        // .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", `rotate(-90)`)
        .attr('y', 0 - margin.left)
        .attr('x', 0-(chartHeight/2))
        .attr("dy", "1em")
        .style('text-anchor', 'middle')
        .style("font-size", "15px")
        .style('stroke', 'bold')
        .text('Obese Residents by State (%)')
        .style('fill', 'green');
    
    chartGroup.append("g")
        .attr("class", "axis")
        // assign to class axis so we can use CSS
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis) 
        .append("text")
        .attr('class', 'label')
        // .attr("transform", `translate(${chartWidth / 2}, ${chartHeight/2})`)
        .attr('x', chartWidth/2)
        .attr('y', 33)
        .style('text-anchor', 'middle')
        .style('font-size', '15px')
        .style('stroke', 'bold')
        .text('Poverty by State (%)')
        .style('fill', 'green');
               
});