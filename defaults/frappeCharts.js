module.exports = {
  component: 'frappe-charts-wrapper',
  "style": "width:100%; height:200px;",
  type: 'bar',
  // "class": "netdata-chart-with-legend-right netdata-dygraph-chart-with-legend-right",
  "interval": 0,
  watch: {
    skip: 30,//some charts like frappe need to skip values for render performance (dygraph does this automatically)
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
              // console.log('TMP val', tmp)

              if(d_index == 0){
                chart.options.data.datasets.push({
                  name: tmp_key,
                  chartType: chart.type,
                  values: [parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ) ]
                })
              }
              else{
                chart.options.data.datasets[counter].values.push( parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ))
              }

              counter++
              // chart.options.labels.push(tmp_key)
            })


          }
        })

        // // console.log('Array.isArray(stat[0].value)', stat[0].value)
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
        // console.log('pre_process frappe-charts-wrapper', chart, name, stat)

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
                      name: tmp_key,
                      chartType: chart.type,
                      values: [parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ) ]
                    })
                  }
                  else{
                    chart.options.data.datasets[counter].values.push( parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ))
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
                  name: name+'_'+v_index,
                  chartType: chart.type,
                  values: [parseFloat( (v.toFixed ) ? v.toFixed(2) : v )]
                })
              }
              else{
                chart.options.data.datasets[v_index].values.push( parseFloat( (v.toFixed ) ? v.toFixed(2) : v ))
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
                  name: name,
                  chartType: chart.type,
                  values: [ parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value ) ]
                })
              }
              else{
                chart.options.data.datasets[0].values.push( parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value ))
              }

          }
        })


      }

      else{
        chart = null
      }
    }

    // console.log('pre_process frappe-charts-wrapper', chart, name)

    return chart
  },
  "options": {
    // data: {
    //   labels: [
    //     // "12am-3am", "3am-6am", "6am-9am", "9am-12pm",
    //     // "12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"
    //   ],
    //
    //   datasets: [
    //     // {
    //     //   name: "Some Data", chartType: 'bar',
    //     //   values: [25, 40, 30, 35, 8, 52, 17, -4]
    //     // },
    //     // {
    //     //   name: "Another Set", chartType: 'bar',
    //     //   values: [25, 50, -10, 15, 18, 32, 27, 14]
    //     // },
    //     // {
    //     //   name: "Yet Another", chartType: 'line',
    //     //   values: [15, 20, -3, -15, 58, 12, -17, 37]
    //     // }
    //   ],
    //
    //   // yMarkers: [{ label: "Marker", value: 70,
    //   //   options: { labelPos: 'left' }}],
    //   // yRegions: [{ label: "Region", start: -10, end: 50,
    //   //   options: { labelPos: 'right' }}]
    // },
    // valuesOverPoints: 1,
    lineOptions: {
      // hideLine: 1,
      regionFill: 1
    },

    // isNavigable: 1,

    // axisOptions: {
    //   yAxisMode: 'span',   // Axis lines, default
    //   xAxisMode: 'tick',   // No axis lines, only short ticks
    //   xIsSeries: 1         // Allow skipping x values for space
    //                         // default: 0
    // },

    // title: "My Awesome Chart",
    type: 'axis-mixed', // or 'bar', 'line', 'pie', 'percentage'
    // height: 400,
    // colors: ['purple', '#ffa3ef', 'light-blue'],
    //
    // tooltipOptions: {
    //   formatTooltipX: d => (d + '').toUpperCase(),
    //   formatTooltipY: d => d + ' pts',
    // }
    // title: "",
    // type: "axis-mixed",
    // data: {
    //   labels: [],
    //   datasets: [],
    // },
    // height: 120,
  },
  // init: function (vue){
  // },


}
