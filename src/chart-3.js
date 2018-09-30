import * as d3 from 'd3'

// Create your margins and height/width
let margin = { top: 25, left: 25, right: 15, bottom: 25 }

let height = 110 - margin.top - margin.bottom

let width = 110 - margin.left - margin.right

// I'll give you this part!
var container = d3.select('#chart-3')

// Create your scales
let xPositionScale = d3.scaleLinear().range([0, width])

let yPositionScale = d3.scaleLinear().range([height, 0])

// Create your line generator
let graphline = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.income))

// Read in your data
Promise.all([
  d3.csv(require('./middle-class-income.csv')),
  d3.csv(require('./middle-class-income-usa.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Create your ready function
function ready([datapointsincome, datapointsincomeUSA]) {
  const nested = d3
    .nest()
    .key(d => {
      return d.country
    })
    .entries(datapointsincome)

  console.log('Nested data looks like', nested)

  container
    .selectAll('.income')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', '.income')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .each(function(d) {
      let svg = d3.select(this)

      svg
        .selectAll('path')
        .data(nested)
        .enter()
        .append('path')
        .att('stroke', 'lightblue')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('d', d => {
          return graphline(d.values)
        })

      svg
        .append('text')
        .text(d.key)
        .attr('font-size', 12)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('dy', -10)

      /* Add in your axes */

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
