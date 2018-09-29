import * as d3 from 'd3'

// Set up margin/height/width
let margin = { top: 25, left: 25, right: 15, bottom: 25 }

let height = 110 - margin.top - margin.bottom

let width = 110 - margin.left - margin.right

// I'll give you the container
let container = d3.select('#chart-2')

// Create your scales
let xPositionScale = d3.scaleLinear().range([0, width])

let yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create a d3.line function that uses your scales

let jpline = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y(function(d) {
    return yPositionScale(d.ASFR_jp)
  })

let usline = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.Age)
  })
  .y(function(d) {
    return yPositionScale(d.ASFR_us)
  })

// Read in your data
d3.csv(require('./fertility.csv'))
  .then(ready)
  .catch(err => console.log(err))

// Build your ready function that draws lines, axes, etc
function ready(datapoints) {
  let ages = datapoints.map(function(d) {
    return d.Age
  })
  xPositionScale.domain(d3.extent(ages))

  let nested = d3
    .nest()
    .key(d => d.Year)
    .entries(datapoints)

  container
    .selectAll('.fertility')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'fertility')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .each(function(d) {
      let svg = d3.select(this)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', jpline)
        .attr('stroke', '#fff7bc')
        .attr('fill', '#fff7bc')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.6)

      svg
        .append('path')
        .datum(d.values)
        .attr('d', usline)
        .attr('stroke', '#bcbddc')
        .attr('fill', '#bcbddc')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.9)
        .lower()

      svg
        .append('text')
        .text(d.key)
        .attr('font-size', 12)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('dy', -10)

      let xAxis = d3.axisBottom(xPositionScale)
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis.ticks(5))

      let yAxis = d3.axisLeft(yPositionScale)
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis.ticks(4))
    })
}
