let DefaultDygraphLine = require('../defaults/dygraph.line')

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{
	// "interval": 5,
  "skip": 5,
  
  pre_process: function(chart, name, stat){
    return chart
  },
  "options": {
    labels: ['Time', '1 min avg', '5 min avg', '15 min avg'],
    fillGraph: false,
  }
})
