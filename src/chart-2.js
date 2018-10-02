import * as d3 from 'd3'

// Set up margin/height/width
let margin = { top: 25, left: 25, right: 15, bottom: 25 }

let height = 110 - margin.top - margin.bottom

let width = 110 - margin.left - margin.right

// I'll give you the container
let container = d3.select('#chart-2')

// Create your scales
let xPositionScale = d3
  .scaleLinear()
  .domain([10, 60])
  .range([0, width])
let yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create a d3.area function that uses your scales
let area1 = d3
  .area()
  .x(d => xPositionScale(d.Age))
  .y1(d => yPositionScale(d.ASFR_jp))
  .y0(d => yPositionScale(0))

let area2 = d3
  .area()
  .x(d => xPositionScale(d.Age))
  .y1(d => yPositionScale(d.ASFR_us))
  .y0(d => yPositionScale(0))

// Read in your data
d3.csv(require('./fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Build your ready function that draws lines, axes, etc
function ready(datapoints) {
  let nested = d3
    .nest()
    .key(function(d) {
      return d.Year
    })
    .entries(datapoints)
  console.log('nested data look like', nested)

  console.log('data look like', datapoints)

  container
    .selectAll('.fertility')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'fertility')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      let svg = d3.select(this)
      let datapoints = d.values
      let sumjp = d3.sum(datapoints, d => +d.ASFR_jp).toFixed(2)
      let sumus = d3.sum(datapoints, d => +d.ASFR_us).toFixed(2)

      console.log('Japan total fertility rate is', sumjp)
      console.log('US total fertility rate is', sumus)
      // add areas
      svg
        .append('path')
        .datum(d.values)
        .attr('d', area1)
        .attr('stroke', '#2c7fb8')
        .style('fill', '#2c7fb8')
        .attr('opacity', 0.4)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', area2)
        .attr('stroke', '#bcbddc')
        .style('fill', '#bcbddc')
        .attr('opacity', 0.4)

      // add text of "year"
      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('font-size', 12)
        .attr('dy', -10)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('fill', '#8856a7')

      // sum for Japan
      svg
        .append('text')
        .text(sumjp)
        .attr('x', (width * 3) / 4)
        .attr('y', 0)
        .attr('font-size', 10)
        .attr('dy', 20)
        .attr('fill', '#2c7fb8')
        .attr('text-anchor', 'middle')

      svg
        .append('text')
        .text(sumus)
        .attr('x', (width * 3) / 4)
        .attr('y', 0)
        .attr('font-size', 10)
        .attr('dy', 30)
        .attr('fill', '#bcbddc')
        .attr('text-anchor', 'middle')

      // Add axes for every svg
      let xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      let yAxis = d3.axisLeft(yPositionScale).tickValues([0, 0.1, 0.2, 0.3])

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}
