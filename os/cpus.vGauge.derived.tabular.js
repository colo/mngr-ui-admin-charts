let DefaultVGaugeDerived = require('../defaults/vGauge.derived')

const mootools = require("mootools")

let debug = require('debug')('mngr-ui-admin-charts:os:cpus.vGauge.derived.tabular'),
    debug_internals = require('debug')('mngr-ui-admin-charts:os:cpus.vGauge.derived.tabular:Internals');

debug.log = console.log.bind(console)
debug_internals.log = console.log.bind(console)

module.exports = Object.merge(Object.clone(DefaultVGaugeDerived),{

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
      let isWindow = (caller && caller.setInterval) ? true : false
      // debug_internals('transform', isWindow, caller, values, chart, cb)
      /**
      * node-tabular-data/data_to_tabular (used on chart.vue) call this tranform too, avoid runnin it
      * Let it trasnform stat to tabular with generic methods
      * Run this one with only with tabular data
      **/
      if(isWindow){
        /**
        * gauges use only one value, so we keep 'last' one, the one with biggest timestamp
        * sort in desc order
        **/
        if(values && Array.isArray(values)){
          values.sort(function (a, b) { return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0) })
          values = [values[0],values[1]]
        }

        // debug_internals('transform2 %o', values)

      }
      else{
        if(chart.prev.length === 0 || (values.length > 0 && values[0] !== null && chart.prev[0] > values[0][0])){//timestamp check
          chart.prev = values.shift()
        }

        Array.each(values, function(row, row_index){
          // debug('transform2 %o', row, chart.prev)

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

                sum += new_row[index]


              }
            })
            let _io = (chart.cores * 1000 ) - sum //10000 was for old node version (looks like a bug, 1000 makes sense)

            new_row[1] = (_io < 0) ? 0 : _io
            values[row_index] = new_row

            chart.prev = prev_row
          }
        })

        debug_internals('transform3', chart.cores, values, caller, chart, cb)

        values = values[values.length - 1]//take last one, hast the biggest timestamp
        let percentage = ( (( (chart.cores * 1000) - values[2] ) * 100) / (chart.cores * 1000)).toFixed(2) * 1 // (total - idle) * 100 / total
        values = [values[0], percentage]


      }

      return values
    },
  },
  init: function (vm, chart, name, stat, type){
    // console.log('memory init: ', vm, chart, name, stat, type)
    stat = Array.clone(stat)
    debug('init', vm, chart, name, stat, type)

    let cores
    if(/^chart/.test(type)){
      if(type === 'chart-tabular'){
        if(Array.isArray(stat)){
          // free = stat[0].value[1]
          cores = stat[0].value[1]
        }
        else{
          cores = stat.value[1]
        }


      }
      else{
        if(Array.isArray(stat) && stat.length > 0){
          // free = stat[0].value[1]
          cores = stat[0].value.cores
        }
        else if(!Array.isArray(stat)){
          cores = stat.value.cores
        }
      }

      chart.cores = cores

      // chart.options.valueRange = [
      //   0,
      //   cores * 1000 //10000 was for old node version (looks like a bug, 1000 makes sense)
      // ]
    }

  },

})
