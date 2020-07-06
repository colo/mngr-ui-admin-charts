let DefaultDygraphLine = require('../defaults/dygraph.derived.tabular')

const mootools = require("mootools")

let debug = require('debug')('mngr-ui-admin-charts:os:cpus'),
    debug_internals = require('debug')('mngr-ui-admin-charts:os:cpus:Internals');


module.exports = Object.merge(Object.clone(DefaultDygraphLine),{

  watch: {

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

      Array.each(values, function(row, row_index){

        if(row && row !== null && row[0] > chart.prev[0]){
          let prev_row = Array.clone(row)
          let new_row = []

          new_row[0] = row[0]
          let sum = 0
          Array.each(row, function(col, index){

            if(index > 1){// index == 0 == timestamp && index == 1 == cores
              //decrease index becasue we won't have 'cores' in graphs

              let __val = (col - chart.prev[index]) / ((row[0] - chart.prev[0]) / 1000) //DERIVE
              new_row[index] = (__val > (chart.cores * 1000 )) ? __val / 2 : __val //10000 was for old node version (looks like a bug, 1000 makes sense)

              // row[index] = ((index === 5 || index === 6) && __val > 20000) ? __val / 2 : __val
              // row[index] = ((index === 5 || index === 6) && row[index] > 20000) ? -1 : row[index]


              // new_row[index - 1] = col - chart.prev[index]
              // new_row[index - 1] = (col - chart.prev[index]) / ((row[0] - chart.prev[0]) / 1000) //DERIVE
              sum += new_row[index]


            }
          })
          let _io = (chart.cores * 1000 ) - sum //10000 was for old node version (looks like a bug, 1000 makes sense)
          // new_row.push((_io < 0) ? 0 : _io)
          new_row[1] = (_io < 0) ? 0 : _io
          // if(sum > (chart.cores * 10000 )){
          //   values[row_index] = undefined
          // }
          // else{
            values[row_index] = new_row
          // }

          chart.prev = prev_row
        }
      })

      values = values.clean()

      debug_internals('transform2', chart.cores, values, caller, chart, cb)

      return values
    }
  },

  init: function (vm, chart, name, stat, type){
    // console.log('memory init: ', vm, chart, name, stat, type)
    stat = Array.clone(stat)
    debug('init', stat)

    if(type === 'chart'){
      let cores
      if(Array.isArray(stat)){
        // free = stat[0].value[1]
        cores = stat[0].value[1]
      }
      else{
        cores = stat.value[1]
      }

      chart.cores = cores

      chart.options.valueRange = [
        0,
        cores * 1000 //10000 was for old node version (looks like a bug, 1000 makes sense)
      ]
    }

  },

  options: {
    labels: ['Time', 'io', 'idle', 'irq', 'nice', 'sys', 'user' ],
    stackedGraph: true,
    valueRange: [0]
  }

})
