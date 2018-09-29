import * as d3 from 'd3'

// Set up margin/height/width

let margin = { top: 30, left: 50, right: 100, bottom: 30 }
let height = 600 - margin.top - margin.bottom
let width = 600 - margin.left - margin.right

// Add svg

let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

// Create a time parser

let parseTime = d3.timeParse('%B-%y')

// Create your scales

let xPositionScale = d3.scaleLinear().range([0, width])

let yPositionScale = d3.scaleLinear().range([height, 0])

let colorScale = d3
  .scaleOrdinal()
  .range([
    '#fde0dd',
    '#fa9fb5',
    '#c51b8a',
    '#ece2f0',
    '#a6bddb',
    '#1c9099',
    '#fff7bc',
    '#fec44f',
    '#d95f0e',
    '#31a354'
  ])

// Create a d3.line function that uses your scales

let line = d3
  .line()
  .x(d => xPositionScale(d.datetime))
  .y(d => yPositionScale(d.price))

// Read in your housing price data

d3.csv(require('./housing-prices.csv'))
  .then(ready)
  .catch(err => console.log(err))

// Write your ready function

function ready(datapoints) {
  // Convert your months to dates
  datapoints.forEach(d => (d.datetime = parseTime(d.month)))

  // Get a list of dates and a list of prices

  let datetimes = datapoints.map(d => d.datetime)
  let prices = datapoints.map(d => d.price)

  // Group your data together

  let nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)

  console.log(nested)

  // Draw your lines

  xPositionScale.domain(d3.extent(datetimes))
  yPositionScale.domain(d3.extent(prices))

  svg
    .selectAll('.line-price')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'line-price')
    .attr('d', d => line(d.values))
    .attr('fill', 'none')
    .attr('stroke', d => colorScale(d.key))
    .attr('stroke-width', 2)
    .lower()

  // Add circles

  svg
    .selectAll('.circle-price')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'circle-price')
    .attr('r', 3)
    .attr('cx', d => xPositionScale(d.values[0].datetime))
    .attr('cy', d => yPositionScale(d.values[0].price))
    .attr('fill', d => colorScale(d.key))

  // Add your text on the right-hand side

  svg
    .selectAll('.text-price')
    .data(nested)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('class', 'text-price')
    .attr('x', d => xPositionScale(d.values[0].datetime))
    .attr('y', d => yPositionScale(d.values[0].price))
    .attr('font-size', 10)
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'start')
    .attr('dx', 7)

  // Add your title

  svg
    .append('text')
    .text('U.S. housing prices fall in winter')
    .attr('x', width / 2)
    .attr('y', 0 - margin.top / 2)
    .attr('dx', 50)
    .attr('font-size', 20)
    .attr('text-anchor', 'middle')

  // Add the shaded rectangle

  svg
    .append('rect')
    .attr('x', d => xPositionScale(parseTime('December-16')))
    .attr('y', 0)
    .attr('height', height)
    .attr('width', (datetimes.length / 10) * 3)
    .attr('opacity', 0.2)
    .lower()

  // Add your axes

  let xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat('%b %y'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)

  let yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}