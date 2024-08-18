import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// retdrive dataset from api
const data = await d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")

console.log(data)
// declare variables 
const height = 630;
const width = 920;
const padding = 40;
const yTextWidth = 25

// mutate the time to date
data.forEach(d => {
   d.place = +d.place
   const [minutes, seconds] = d.Time.split(":")
   d.Time = new Date(2003, 10, 15, 12, minutes, seconds)
})
 

// xScale min && max
let xMin = d3.min(data, index => index.Year - 1)
let xMax = d3.max(data, index => index.Year + 1)

// yScale min && max
let [yMin,yMax] = d3.extent(data, d => d.Time)

// scales for x,y
let xScale = d3.scaleLinear([xMin,xMax], [padding, width-padding])
let yScale = d3.scaleTime([yMin, yMax], [padding, height-padding])


// axis for x,y
let xAxis = d3.axisBottom(xScale)
let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'))

console.log(yScale("39:22"))

const svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)

// appending xAxis            
svg.append("g")
   .attr("transform", `translate(${yTextWidth}, ${height - padding})`)
   .call(xAxis)

// appending yAxis
svg.append("g")
   .attr("transform", `translate(${padding+yTextWidth}, 0)`)
   .call(yAxis)

// yAxis caption
svg.append("text")
.text("Time in Minutes")
.attr("x", -330)
.attr("y", yTextWidth)
.attr("id", "text-y")
.attr("transform", `rotate(-90)`)

svg.selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
   .attr("r", 6)
   .attr("cx", d => xScale(d.Year) + yTextWidth )
   .attr("cy", d => yScale(d.Time))
   .attr("fill", "red")




