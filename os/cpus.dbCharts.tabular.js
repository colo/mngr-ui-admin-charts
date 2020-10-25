let DefaultDbCharts = require('../defaults/dbCharts')

const mootools = require("mootools")

let debug = require('debug')('mngr-ui-admin-charts:os:cpus.dbCharts'),
    debug_internals = require('debug')('mngr-ui-admin-charts:os:cpus.dbCharts:Internals');

debug.log = console.log.bind(console)
debug_internals.log = console.log.bind(console)

module.exports = Object.merge(Object.clone(DefaultDbCharts),{

  watch: {
    skip: 15,//some charts like frappe need to skip values for render performance (dygraph does this automatically)
    managed: true,
    /**
    * @trasnform: diff between each value against its prev one
    */
    transform: function(values, caller, chart, cb){


      let isWindow = (caller && caller.setInterval) ? true : false
      /**
      * node-tabular-data/data_to_tabular (used on chart.vue) call this tranform too, avoid runnin it
      * Let it trasnform stat to tabular with generic methods
      * Run this one with only with tabular data
      **/
      let data = { labels: [], datasets: [] }

      if(isWindow === true){
        let _values = Array.clone(values)
        // if(values && Array.isArray(values)){
        _values = _values.sort(function (a, b) { return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0) })
        // }
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
            new_row.value['idle'] = new_row.value['idle'] * -1
            _values[row_index] = new_row
            // }

            chart.prev = prev_row
          }
        })

        debug('transformed _values %s %o', caller, _values, chart, cb)
          /**
          * dynamic, like 'cpus', that is an Array (multiple cores) of Objects and we wanna watch a specific value
          * cpus[0].value[N].times[idle|irq...]
          */
          if(Array.isArray(_values[0].value)
            && chart.watch && chart.watch.value
            && _values[0].value[0][chart.watch.value]
          ){
            Array.each(_values, function(d, d_index){
              if(
                !chart.watch.skip
                || (
                  d_index == 0
                  || (d_index % chart.watch.skip == 0)
                  || d_index == d.length - 1
                )
              ){
                data.labels.push(new Date(d.timestamp).toLocaleTimeString())

                let counter = 0
                Object.each(d.value[0][chart.watch.value], function(tmp, tmp_key){
                  // //console.log('TMP val', tmp)

                  if(d_index == 0){
                    data.datasets.push({
                      label: tmp_key,
                      // chartType: chart.type,
                      data:  [parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ) ]
                    })
                  }
                  else{
                    data.datasets[counter].data.push( parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ))
                  }

                  counter++
                  // chart.options.labels.push(tmp_key)
                })


              }
            })

            // // //console.log('Array.isArray(_values[0].value)', _values[0].value)
            // Object.each(_values[0].value[0][chart.watch.value], function(tmp, tmp_key){
            //   chart.options.labels.push(tmp_key)
            // })
            //
            // chart.options.labels.unshift('Time')

          }
          /**
          * dynamic, like 'blockdevices' or 'networkInterfaces', that is an Object and we wanna watch a specific value
          * _values[N].value.stats[in_flight|io_ticks...]
          */
          else if(isNaN(_values[0].value) && !Array.isArray(_values[0].value)){//an Object
            debug('transform2 %s %o', caller, _values, chart, cb)
            // //console.log('pre_process frappe-charts-wrapper', chart, name, _values)

            //if no "watch.value" property, everything should be manage on "trasnform" function
            // if(
            //   chart.watch && chart.watch.managed != true
            //   || !chart.watch
            // ){

              Array.each(_values, function(d, d_index){
                if(
                  !chart.watch.skip
                  || (
                    d_index == 0
                    || (d_index % chart.watch.skip == 0)
                    || d_index == d.length - 1
                  )
                ){
                  let obj = {}
                  if(chart.watch.value){
                    obj = d.value[chart.watch.value]
                  }
                  else{
                    obj = d.value
                  }

                  data.labels.push(new Date(d.timestamp).toLocaleTimeString())

                  let counter = 0
                  Object.each(obj, function(tmp, tmp_key){
                    if(
                      !chart.watch
                      || !chart.watch.exclude
                      || (chart.watch.exclude && chart.watch.exclude.test(tmp_key) == false)
                    ){

                      if(d_index == 0){
                      // if(data.datasets.length == 0){
                        data.datasets.push({
                          label: tmp_key,
                          // chartType: chart.type,
                          data:  [parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ) ]
                        })
                      }
                      else{
                        data.datasets[counter].data.push( parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ))
                      }

                      counter++
                      // chart.options.labels.push(tmp_key)
                    }
                  })


                }
              })


            // }


          }
          //simple, like 'loadavg', that has 3 columns
          else if(Array.isArray(_values[0].value)){

            Array.each(_values, function(d, d_index){
              if(
                !chart.watch.skip
                || (
                  d_index == 0
                  || (d_index % chart.watch.skip == 0)
                  || d_index == d.length - 1
                )
              ){
                data.labels.push(new Date(d.timestamp).toLocaleTimeString())

                Array.each(d.value, function(v, v_index){
                  if(d_index == 0){
                    data.datasets.push({
                      name: name+'_'+v_index,
                      // chartType: chart.type,
                      data:  [parseFloat( (v.toFixed ) ? v.toFixed(2) : v )]
                    })
                  }
                  else{
                    data.datasets[v_index].data.push( parseFloat( (v.toFixed ) ? v.toFixed(2) : v ))
                  }
                })
              }
            })

          }
          //simple, like 'uptime', that has one simple Numeric value
          else if(!isNaN(_values[0].value)){//
            Array.each(_values, function(d, d_index){
              if(
                !chart.watch.skip
                || (
                  d_index == 0
                  || (d_index % chart.watch.skip == 0)
                  || d_index == d.length - 1
                )
              ){
                data.labels.push(new Date(d.timestamp).toLocaleTimeString())

                  if(d_index == 0){
                    data.datasets.push({
                      label: name,
                      // chartType: chart.type,
                      data:  [ parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value ) ]
                    })
                  }
                  else{
                    data.datasets[0].data.push( parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value ))
                  }

              }
            })


          }

          // else{
          //   chart = null
          // }
        // }
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

      chart.options.valueRange = [
        0,
        cores * 1000 //10000 was for old node version (looks like a bug, 1000 makes sense)
      ]
    }

  },
  "props": {
    height: 250,
    component: 'DbChartjsLine',
  },
  // options: {
  //   labels: ['Time', 'io', 'idle', 'irq', 'nice', 'sys', 'user' ],
  //   stackedGraph: true,
  //   valueRange: [0]
  // }

})
