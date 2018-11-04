// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//   // Retrieve data from the CSV file and execute everything below
var file = "../assets/data/data.csv"
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
  throw error;
}


// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
                      .domain([d3.min(data, d => d[chosenXAxis]),
                       d3.max(data, d => d[chosenXAxis])
    ])
    .range([0, width])
    .nice();

  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating x-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
                      .domain([d3.min(data, d => d[chosenYAxis]), d3.max(data, d => d[chosenYAxis])])
                      .range([height, 0]);
  return yLinearScale;                      
}

function successHandle(data) {

  // parse data
  data.forEach(function(d) {
      d.age = +d.age
      d.ageMoe = +d.ageMoe
      d.healthcare = +d.healthcare
      d.healthcareHigh = +d.healthcareHigh
      d.healthcareLow = +d.healthcareLow
      d.id = +d.id
      d.income = +d.income
      d.incomeMoe = + d.incomeMoe
      d.obesity = +d.obesity
      d.obesityHigh = +d.obesityHigh
      d.obesityLow = +d.obesityLow
      d.poverty = +d.poverty
      d.povertyMoe = +d.povertyMoe
      d.smokes = +d.smokes
      d.smokesHigh = +d.smokesHigh
      d.smokesLow = +d.smokesLow
  });
  console.log(data);

    // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(data, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

   // append x axis
  chartGroup.append("g")
    .data(data)
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

   // append y axis
  chartGroup.append("g")
    .call(leftAxis);

 // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("stroke","black")
    .attr("fill", "blue")
    .attr("opacity", ".8")

    circlesGroup.append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(function(d) {
      return d.abbr;
    })
    // Now place the text using our scale.
    .attr("dx", function(d) {
      return xLinearScale(d[chosenXAxis]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yLinearScale(d[chosenYAxis]) + 15 / 2.5;
    })    
        

  // Create group for  2 x- axis labels
  var labelsXGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  // var albumsLabel = labelsXGroup.append("text")
  //   .attr("x", 0)
  //   .attr("y", 40)
  //   .attr("value", "num_albums") // value to grab for event listener
  //   .classed("inactive", true)
  //   .text("# of Albums Released");

  // Create group for  2 y- axis labels
  var labelsYGroup = chartGroup.append("g")
    .attr("transform", `translate(${height / 2 - 150}, ${0})`);

  // append y axis
  var Healthcare = labelsYGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left - 20)
    .attr("x", 0 - ((height / 2) -12))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .classed("active", true)    
    .text("Lacks Healthcare (%)");      

}

