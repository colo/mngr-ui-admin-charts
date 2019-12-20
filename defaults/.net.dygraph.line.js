let DefaultDygraphLine = require('./dygraph.line')

module.exports = Object.merge(Object.clone(DefaultDygraphLine), {
  options: {
    // labels: ['Time', 'Out', 'In'],
    fillGraph: true
  }
})
