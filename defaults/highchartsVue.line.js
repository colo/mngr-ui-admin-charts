// import * as Highcharts from 'highcharts'

/**
* boost
* https://www.highcharts.com/docs/advanced-chart-features/boost-module
**/
// require('highcharts/modules/boost')(Highcharts)

module.exports = {
  component: 'highcharts-vue-wrapper',
  "style": "width:100%; height:200px;",
  // type: 'line',
  "class": "netdata-chart-with-legend-right netdata-dygraph-chart-with-legend-right",
  "interval": 0,
  watch: {
    skip: 30,//some charts like frappe need to skip values for render performance (dygraph does this automatically)
  },
  pre_process: function(chart, name, stat){


    if(!chart.options
      || !chart.options.xAxis
      || !chart.options.xAxis.categories
      || chart.options.xAxis.categories.length == 0
    ){
      if(!chart.options)
        chart.options = {}

      if(!chart.options.xAxis)
        chart.options.xAxis = {}

      if(!chart.options.xAxis.categories)
        chart.options.xAxis.categories = []

      if(!chart.options.series)
        chart.options.series = []




      /**
      * dynamic, like 'cpus', that is an Array (multiple cores) of Objects and we wanna watch a specific value
      * cpus[0].value[N].times[idle|irq...]
      */
      if(Array.isArray(stat[0].value)
        && chart.watch && chart.watch.value
        && stat[0].value[0][chart.watch.value]
      ){
        console.log('highcharts-vue-wrapper', chart, name, stat)

        Array.each(stat, function(d, d_index){
          if(
            !chart.watch.skip
            || (
              d_index == 0
              || (d_index % chart.watch.skip == 0)
              || d_index == d.length - 1
            )
          ){
            // chart.options.data.labels.push(new Date(d.timestamp).toLocaleTimeString())

            let counter = 0
            Object.each(d.value[0][chart.watch.value], function(tmp, tmp_key){
              // console.log('TMP val', tmp)

              if(d_index == 0){
                chart.options.series.push({
                  name: tmp_key,
                  data: [[
                    d.timestamp,
                    // parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value )
                     parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp )
                  ]]
                })
              }
              else{
                chart.options.series[counter].data.push([
                  d.timestamp,
                  // parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value )
                   parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp )
                ])
              }

              // if(d_index == 0){
              //   chart.options.data.datasets.push({
              //     name: tmp_key,
              //     chartType: chart.type,
              //     values: [parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ) ]
              //   })
              // }
              // else{
              //   chart.options.data.datasets[counter].values.push( parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp ))
              // }

              counter++
              // chart.options.labels.push(tmp_key)
            })


          }
        })



      }
      /**
      * dynamic, like 'blockdevices' or 'networkInterfaces', that is an Object and we wanna watch a specific value
      * stat[N].value.stats[in_flight|io_ticks...]
      */
      else if(isNaN(stat[0].value) && !Array.isArray(stat[0].value)){//an Object
        console.log('highcharts-vue-wrapper', chart, name, stat)

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

              // chart.options.data.labels.push(new Date(d.timestamp).toLocaleTimeString())

              let counter = 0
              Object.each(obj, function(tmp, tmp_key){
                if(
                  !chart.watch
                  || !chart.watch.exclude
                  || (chart.watch.exclude && chart.watch.exclude.test(tmp_key) == false)
                ){

                  if(d_index == 0){
                    chart.options.series.push({
                      name: tmp_key,
                      data: [[
                        d.timestamp,
                        // parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value )
                         parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp )
                      ]]
                    })
                  }
                  else{
                    chart.options.series[counter].data.push([
                      d.timestamp,
                      // parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value )
                       parseFloat( (tmp.toFixed ) ? tmp.toFixed(2) : tmp )
                    ])
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
            // chart.options.data.labels.push(new Date(d.timestamp).toLocaleTimeString())

            Array.each(d.value, function(v, v_index){
              if(d_index == 0){
                chart.options.series.push({
                  name: name+'_'+v_index,
                  data: [[
                    d.timestamp,
                    // parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value )
                    d.value
                  ]]
                })
              }
              else{
                chart.options.series[v_index].data.push([
                  d.timestamp,
                  // parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value )
                  v
                ])
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


            if(d_index == 0){
              chart.options.series.push({
                name: name,
                data: [[
                  d.timestamp,
                  // parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value )
                  d.value
                ]]
              })
            }
            else{
              chart.options.series[0].data.push([
                d.timestamp,
                // parseFloat( (d.value.toFixed ) ? d.value.toFixed(2) : d.value )
                d.value
              ])
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
    type: 'spline',
    marginRight: 10,
    chart: {
      zoomType: 'x'
    },
    time: {
        useUTC: false
    },

    // title: {
    //   // text: 'Solar Employment Growth by Sector, 2010-2016'
    // },
    title: undefined,

    subtitle: {
      // text: 'Source: thesolarfoundation.com'
    },

    xAxis: {
      type: 'datetime',
      minTickInterval: 30 * 1000,
      labels: {
        format: '{value:%k:%M:%S}',
      },
      gridLineWidth: 1,
      tickPixelInterval: 150
      // categories: [
      //   // 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      // ]
    },


    yAxis: [{ // left y axis
        title: {
            text: null
        },
        labels: {
            align: 'left',
            x: 3,
            y: 16,
            format: '{value:.,0f}'
        },
        showFirstLabel: false
    }, { // right y axis
        linkedTo: 0,
        gridLineWidth: 0,
        opposite: true,
        title: {
            text: null
        },
        labels: {
            align: 'right',
            x: -3,
            y: 16,
            format: '{value:.,0f}'
        },
        showFirstLabel: false
    }],

    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      labelFormatter: function() {
        var lastVal = this.yData[this.yData.length - 1];
        return '<span style="color:' + this.color + '">' + this.name + ': </span> <b>' + lastVal + '</b> </n>';
      }
    },


    tooltip: {
        shared: true,
        crosshairs: true
    },

    //boost module
    boost: {
      enabled: false,
      seriesThreshold: 1,
      useAlpha: false,
      allowForce: true
    },

    plotOptions: {
      series: {
        boostThreshold: 1//boost module
    //     label: {
    //       connectorAllowed: false
    //     },
    //     // pointStart: 2010
      }
    },

    series: [

    ],

    // responsive: {
    //   rules: [{
    //     condition: {
    //        maxWidth: 500
    //     },
    //     chartOptions: {
    //       legend: {
    //         layout: 'horizontal',
    //         align: 'center',
    //         verticalAlign: 'bottom'
    //       }
    //     }
    //   }]
    // }
  },
  // init: function (vue){
  // },


}
