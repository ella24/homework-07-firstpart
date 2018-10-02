import * as d3 from 'd3'

// Create your margins and height/width
let margin = { top: 60, left: 50, right: 50, bottom: 60 }

let height = 300 - margin.top - margin.bottom

let width = 300 - margin.left - margin.right

// I'll give you this part!
var container = d3.select('#chart-3')

// Create your scales
let xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010])
  .range([0, width])

let yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator
let lineworld = d3
  .line()
  .x(function(d) {
    return xPositionScale(+d.year)
  })
  .y(function(d) {
    return yPositionScale(+d.income)
  })

let lineusa = d3
  .line()
  .x(function(d) {
    return xPositionScale(+d.year)
  })
  .y(function(d) {
    return yPositionScale(+d.income)
  })

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
  console.log(datapointsincomeUSA)
  let nestedworld = d3
    .nest()
    .key(d => {
      return d.country
    })
    .entries(datapointsincome)
  console.log('Incomes from the world data looks like', nestedworld)

  // let yearUSA = datapointsincomeUSA.map(d => d.year)

  // xPositionScale.domain(yearUSA)

  container
    .selectAll('.income-graph')
    .data(nestedworld)
    .enter()
    .append('svg')
    .attr('class', '.income-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .each(function(d) {
      let svg = d3.select(this)
      let datapoints = d.values

      svg
        .append('path')
        .datum(datapoints)
        .attr('d', lineworld)
        .attr('stroke-width', 2)
        .attr('stroke', '#dd1c77')
        .attr('fill', 'none')
        .lower()

      svg
        .append('path')
        .datum(datapointsincomeUSA)
        .attr('d', lineusa)
        .attr('stroke-width', 2)
        .attr('stroke', '#a6bddb')
        .attr('fill', 'none')

      svg
        .append('text')
        .text(d.key)
        .attr('font-size', 12)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .attr('dy', -10)
        .attr('font-weight', 'bold')
        .attr('fill', '#dd1c77')

      svg
        .append('text')
        .text('USA')
        .attr('x', (width * 1) / 6)
        .attr('y', 0)
        .attr('font-size', 13)
        .attr('font-weight', 'bold')
        .attr('fill', '#a6bddb')
        .attr('dy', 20)
        .attr('text-anchor', 'start')

      /* Add in your axes */

      var xAxis = d3
        .axisBottom(xPositionScale)
        .tickSize(-height)
        .tickFormat(d3.format('d'))
        .tickValues([1980, 1990, 2000, 2010])

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
      svg
        .selectAll('.x-axis line')
        .attr('stroke-dasharray', '2 3')
        .attr('stroke-linecap', 'round')
        .attr('fill', '#bdbdbd')

      var yAxis = d3
        .axisLeft(yPositionScale)
        .ticks(4)
        .tickSize(-width)
        .tickFormat(d => '$' + d)
        .tickValues([5000, 10000, 15000, 20000])

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

      svg
        .selectAll('.y-axis line')
        .attr('stroke-dasharray', '2 3')
        .attr('stroke-linecap', 'round')
        .attr('fill', '#bdbdbd')
      svg.select('.axis').lower()
      svg.selectAll('.domain').remove()
    })
}
