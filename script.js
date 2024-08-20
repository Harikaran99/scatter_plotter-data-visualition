import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// retdrive dataset from api
const data = await d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")

console.log(data)
// declare variables 
const height = 630;
const width = 920;
const padding = 40;
const paddingTop = 90
const paddingRight = 60
const yAxisTextMargin = 25

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
let xScale = d3.scaleLinear([xMin,xMax], [padding, width-paddingRight])
let yScale = d3.scaleTime([yMin, yMax], [paddingTop, height-padding])


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
   .attr("transform", `translate(${yAxisTextMargin}, ${height - padding})`)
   .call(xAxis)

// appending yAxis
svg.append("g")
   .attr("transform", `translate(${padding+yAxisTextMargin}, 0)`)
   .call(yAxis)

// Title text
svg.append("text")
.text("Doping in Professional Bicycle Racing")
.attr("text-anchor", "middle")
.attr("x", width/2)
.attr("y", 45)
.attr("id", "title")

// Sub Title text
svg.append("text")
.text("35 Fastest times up Alpe d'Huez")
.attr("text-anchor", "middle")
.attr("x", width/2)
.attr("y", 75)
.attr("id", "subtitle")

// yAxis caption
svg.append("text")
.text("Time in Minutes")
.attr("x", -330)
.attr("y", yAxisTextMargin)
.attr("id", "text-y")
.attr("transform", `rotate(-90)`)


// tooltip for circles
const tooltip = d3.select("body")
                  .append("div")
                  .attr("id", "tooltip")

//scatterploted data with circles
svg.selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
   .attr("r", 6)
   .attr("cx", d => xScale(d.Year) + yAxisTextMargin )
   .attr("cy", d => yScale(d.Time))
   .attr("class", "dot")
   .attr("fill", d => d.Doping ? "rgb(173, 59, 59)" : "green")
   .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 0.9)
      tooltip.html(`
         <p>${d.Name}: ${d.Nationality}</p>
         <p>Year: ${d.Year}, Time: ${d.Time}</p>
         `)
   })

//legends for data
const legend_data = [["No doping allegations", "green"], ["Riders with doping allegations", "rgb(173, 59, 59)"]]
const legends = svg.append('g')
                   .attr("id", "legend-label")
                   .attr("transform", `translate(${width-50}, 230)`)
                   .selectAll("text")
                   .data(legend_data)
                   .enter()
                   .append("g")
                   .attr("class", "legend-label")
                   
legends.append("text")
       .text(d => d[0])
       .attr("style", "text-anchor: end")
       .attr("x", 0)
       .attr("y", (d,i) => i * 30)
legends.append("rect")
       .attr("height", 17)
       .attr("width", 17)
       .attr("x", 10)
       .attr("y", (d,i) => (i * 30) - 13)
       .attr("fill", (d, i) => d[1])

                        




