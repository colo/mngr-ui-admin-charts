let debug = require('debug')('mngr-ui-admin-charts:defaults:dbCharts'),
    debug_internals = require('debug')('mngr-ui-admin-charts:defaults:dbCharts:Internals');

debug.log = console.log.bind(console)
debug_internals.log = console.log.bind(console)

module.exports = {
  // component: 'frappe-charts-wrapper',
  // "style": "width:100%; height:200px;",
  // type: 'bar',
  // "class": "netdata-chart-with-legend-right netdata-dygraph-chart-with-legend-right",
  "interval": 0,
  watch: {
    // skip: 30,//some charts like frappe need to skip values for render performance (dygraph does this automatically)
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

          /**
          * dynamic, like 'cpus', that is an Array (multiple cores) of Objects and we wanna watch a specific value
          * cpus[0].value[N].times[idle|irq...]
          */
          if(Array.isArray(values[0].value)
            && chart.watch && chart.watch.value
            && values[0].value[0][chart.watch.value]
          ){
            Array.each(values, function(d, d_index){
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
                      data: [parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ) ]
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

            // // //console.log('Array.isArray(values[0].value)', values[0].value)
            // Object.each(values[0].value[0][chart.watch.value], function(tmp, tmp_key){
            //   chart.options.labels.push(tmp_key)
            // })
            //
            // chart.options.labels.unshift('Time')

          }
          /**
          * dynamic, like 'blockdevices' or 'networkInterfaces', that is an Object and we wanna watch a specific value
          * values[N].value.stats[in_flight|io_ticks...]
          */
          else if(isNaN(values[0].value) && !Array.isArray(values[0].value)){//an Object
            debug('transform %s %o', caller, values, chart, cb)
            // //console.log('pre_process frappe-charts-wrapper', chart, name, values)

            //if no "watch.value" property, everything should be manage on "trasnform" function
            // if(
            //   chart.watch && chart.watch.managed != true
            //   || !chart.watch
            // ){

              Array.each(values, function(d, d_index){
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
                          data: [parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ) ]
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
          else if(Array.isArray(values[0].value)){

            Array.each(values, function(d, d_index){
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
                      label: name+'_'+v_index,
                      // chartType: chart.type,
                      data: [parseFloat( (v.toFixed ) ? v.toFixed(2) : v )]
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
          else if(!isNaN(values[0].value)){//
            Array.each(values, function(d, d_index){
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
                      data: [ parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value ) ]
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
        debug('transform2 %s %o', caller, data, chart, cb)

        // return [data]
        cb(chart.name, [data])
      }
      else{
        return values
      }




    }
  },
  pre_process: function(chart, name, stat){

    if(!chart.options
      || !chart.options.data
      || !chart.options.data.labels
    ){
      if(!chart.options)
        chart.options = {}

      if(!chart.options.data)
        chart.options.data = {}

      if(!chart.options.data.labels)
        chart.options.data.labels = []

      if(!chart.options.data.datasets)
        chart.options.data.datasets = []


      /**
      * dynamic, like 'cpus', that is an Array (multiple cores) of Objects and we wanna watch a specific value
      * cpus[0].value[N].times[idle|irq...]
      */
      if(Array.isArray(stat[0].value)
        && chart.watch && chart.watch.value
        && stat[0].value[0][chart.watch.value]
      ){
        Array.each(stat, function(d, d_index){
          if(
            !chart.watch.skip
            || (
              d_index == 0
              || (d_index % chart.watch.skip == 0)
              || d_index == d.length - 1
            )
          ){
            chart.options.data.labels.push(new Date(d.timestamp).toLocaleTimeString())

            let counter = 0
            Object.each(d.value[0][chart.watch.value], function(tmp, tmp_key){
              // //console.log('TMP val', tmp)

              if(d_index == 0){
                chart.options.data.datasets.push({
                  label: tmp_key,
                  // chartType: chart.type,
                  data: [parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ) ]
                })
              }
              else{
                chart.options.data.datasets[counter].data.push( parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ))
              }

              counter++
              // chart.options.labels.push(tmp_key)
            })


          }
        })

        // // //console.log('Array.isArray(stat[0].value)', stat[0].value)
        // Object.each(stat[0].value[0][chart.watch.value], function(tmp, tmp_key){
        //   chart.options.labels.push(tmp_key)
        // })
        //
        // chart.options.labels.unshift('Time')

      }
      /**
      * dynamic, like 'blockdevices' or 'networkInterfaces', that is an Object and we wanna watch a specific value
      * stat[N].value.stats[in_flight|io_ticks...]
      */
      else if(isNaN(stat[0].value) && !Array.isArray(stat[0].value)){//an Object
        // //console.log('pre_process frappe-charts-wrapper', chart, name, stat)

        //if no "watch.value" property, everything should be manage on "trasnform" function
        if(
          chart.watch && chart.watch.managed != true
          || !chart.watch
        ){

          Array.each(stat, function(d, d_index){
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

              chart.options.data.labels.push(new Date(d.timestamp).toLocaleTimeString())

              let counter = 0
              Object.each(obj, function(tmp, tmp_key){
                if(
                  !chart.watch
                  || !chart.watch.exclude
                  || (chart.watch.exclude && chart.watch.exclude.test(tmp_key) == false)
                ){

                  if(d_index == 0){
                  // if(chart.options.data.datasets.length == 0){
                    chart.options.data.datasets.push({
                      label: tmp_key,
                      // chartType: chart.type,
                      data: [parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ) ]
                    })
                  }
                  else{
                    chart.options.data.datasets[counter].data.push( parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ))
                  }

                  counter++
                  // chart.options.labels.push(tmp_key)
                }
              })


            }
          })


        }


      }
      //simple, like 'loadavg', that has 3 columns
      else if(Array.isArray(stat[0].value)){

        Array.each(stat, function(d, d_index){
          if(
            !chart.watch.skip
            || (
              d_index == 0
              || (d_index % chart.watch.skip == 0)
              || d_index == d.length - 1
            )
          ){
            chart.options.data.labels.push(new Date(d.timestamp).toLocaleTimeString())

            Array.each(d.value, function(v, v_index){
              if(d_index == 0){
                chart.options.data.datasets.push({
                  label: name+'_'+v_index,
                  // chartType: chart.type,
                  data: [parseFloat( (v.toFixed ) ? v.toFixed(2) : v )]
                })
              }
              else{
                chart.options.data.datasets[v_index].data.push( parseFloat( (v.toFixed ) ? v.toFixed(2) : v ))
              }
            })
          }
        })

      }
      //simple, like 'uptime', that has one simple Numeric value
      else if(!isNaN(stat[0].value)){//
        Array.each(stat, function(d, d_index){
          if(
            !chart.watch.skip
            || (
              d_index == 0
              || (d_index % chart.watch.skip == 0)
              || d_index == d.length - 1
            )
          ){
            chart.options.data.labels.push(new Date(d.timestamp).toLocaleTimeString())

              if(d_index == 0){
                chart.options.data.datasets.push({
                  label: name,
                  // chartType: chart.type,
                  data: [ parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value ) ]
                })
              }
              else{
                chart.options.data.datasets[0].data.push( parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value ))
              }

          }
        })


      }

      else{
        chart = null
      }
    }

    // //console.log('pre_process frappe-charts-wrapper', chart, name)
    debug('pre_process', chart, stat, name)
    chart.name = name
    if(chart.options && !chart.options.title) chart.options.title = name
    return chart
  },
  // "props": {
  //   height: 250,
  //   component: 'DbChartjsLine',
  // },
  // "options": {
  //   stackedGraph: true,
  //   title: 'Traffic over time',
  //   // ylabel: 'Requests, Mil.',
  //   // labels: ['Date', 'Success', 'Error'],
  //   legend: 'always'
  // },
  // init: function (vue){
  // },


}
