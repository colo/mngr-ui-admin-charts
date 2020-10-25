let DefaultDygraphLine = require('./dygraph.line')

const mootools = require("mootools")

let debug = require('debug')('mngr-ui-admin-charts:defaults:dygraph.derived.tabular'),
    debug_internals = require('debug')('mngr-ui-admin-charts:defaults:dygraph.derived.tabular:Internals');

debug.log = console.log.bind(console)
debug_internals.log = console.log.bind(console)

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{

  /**
  * @var: save prev cpu data, need to calculate current cpu usage
  **/
  prev: [],
  watch: {
    // merge: true,
    // cumulative: true,
    // value: 'times',
    /**
    * @trasnform: diff between each value against its prev one
    */
    transform: function(values, caller, chart, cb){
      debug_internals('transform %s %o', caller, values, chart, cb)
      values = JSON.parse(JSON.stringify(values))
      if(chart.prev.length === 0 || (values.length > 0 && values[0] !== null && chart.prev[0] > values[0][0])){//timestamp check
        chart.prev = values.shift()
        // chart.prev = values[0]
      }

      Array.each(values, function(row){
        if(row && row !== null && row[0] > chart.prev[0]){
          let prev_row = Array.clone(row)

          Array.each(row, function(col, index){
            if(index > 0){// index == 0 == timestamp
              row[index] = col - chart.prev[index]
              row[index] = (col - chart.prev[index]) / ((row[0] - chart.prev[0]) / 1000) //DERIVE
            }
          })

          chart.prev = prev_row
        }
      })


      debug_internals('transform2', values, caller, chart, cb)

      return values
    }
  },

})
