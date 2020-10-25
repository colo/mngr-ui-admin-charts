let DefaultAmcharts4 = require('../defaults/amcharts4')

const mootools = require("mootools")

let debug = require('debug')('mngr-ui-admin-charts:os:cpus.amcharts4.barRace'),
    debug_internals = require('debug')('mngr-ui-admin-charts:os:cpus.amcharts4.barRace:Internals');

debug.log = console.log.bind(console)
debug_internals.log = console.log.bind(console)

module.exports = Object.merge(Object.clone(DefaultAmcharts4),{

  watch: {
    // skip: 15,//some charts like frappe need to skip values for render performance (dygraph does this automatically)
    managed: true,
    /**
    * @trasnform: diff between each value against its prev one
    */
    transform: function(values, caller, chart, cb){
      // debug('transform %s %o', caller, values, chart, cb)

      let isWindow = (caller && caller.setInterval) ? true : false
      /**
      * node-tabular-data/data_to_tabular (used on chart.vue) call this tranform too, avoid runnin it
      * Let it trasnform stat to tabular with generic methods
      * Run this one with only with tabular data
      **/
      let data = { labels: [], datasets: [] }

      if(isWindow === true){
        let _values = Array.clone(values)
        if(_values && Array.isArray(_values)){
          _values.sort(function (a, b) { return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0) })
          _values = [_values[0],_values[1]]
        }

        debug('transform sorted %o', _values)

        chart.prev = _values.shift()
        Array.each(_values, function(row, row_index){

          if(row && row !== null && row.timestamp > chart.prev.timestamp){


            let prev_row = Object.clone(row)
            let new_row = {timestamp: 0, value: {}}

            new_row.timestamp = row.timestamp
            let sum = 0

            Object.each(row.value, function(col, prop){

              if(prop !== 'cores'){// index == 0 == timestamp && index == 1 == cores
                //decrease index becasue we won't have 'cores' in graphs

                let __val = (col - chart.prev.value[prop]) / ((row.timestamp - chart.prev.timestamp) / 1000) //DERIVE
                new_row.value[prop] = (__val > (chart.cores * 1000 )) ? __val / 2 : __val //10000 was for old node version (looks like a bug, 1000 makes sense)

                sum += new_row.value[prop]


              }
            })
            let _io = (chart.cores * 1000 ) - sum //10000 was for old node version (looks like a bug, 1000 makes sense)
            // new_row.push((_io < 0) ? 0 : _io)
            new_row.value['io'] = (_io < 0) ? 0 : _io
            // if(sum > (chart.cores * 10000 )){
            //   _values[row_index] = undefined
            // }
            // else{
            // new_row.value['idle'] = new_row.value['idle'] * -1
            _values[row_index] = new_row
            // }

            chart.prev = prev_row
          }
        })

        let data = []
        Object.each(_values[0].value, function(time, prop){
          data.push({type: prop, time: time})
        })
        debug('transformed _values %s %o', caller, _values, chart, cb)

        debug('transform3 %s %o', caller, data, chart, cb)
        // return [data]
        cb('os.cpus', [data])
      }
      else{
        return values
      }




    }
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
  props:{
    categoryY: 'type',
    valueX: 'time',
    label: '',
    /* label: (sum === true) ? 'Per CGI count (sum)' : 'Per CGI count', */
    zoom: function (data, categoryY, valueX) {
      const min_zoom = 0.5
      const max_zoom = 1
      /* const min_length = 8 */
      const max_length = 15
      let length = data.length
      /* let zoom = 1 */

      if (data.length <= max_length) {
        return max_zoom
      } else {
        return (max_length / data.length < min_zoom) ? min_zoom : max_length / data.length
      }
    },
    /* colorScheme: colorScheme,
    dark: dark, */
    sum: false
  }
  // options: {
  //   labels: ['Time', 'io', 'idle', 'irq', 'nice', 'sys', 'user' ],
  //   stackedGraph: true,
  //   valueRange: [0]
  // }

})
