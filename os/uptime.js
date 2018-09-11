let DefaultDygraphLine = require('../defaults/dygraph.line')

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{

  pre_process: function(chart, name, stat){
    return chart
  },
  "options": {
    labels: ['Time', 'seconds'],
  }
})
