export default {
  component: 'vue-echarts3-wrapper',
  type: 'line',
  "style": "width:100%; height:250px;",
  "class": "netdata-chart-with-legend-right netdata-dygraph-chart-with-legend-right",
  "interval": 0,
  watch: {
    skip: 30,//some charts like frappe need to skip values for render performance (dygraph does this automatically)
  },
  pre_process: function(chart, name, stat){
    // console.log('vue-echarts3-wrapper', chart, name, stat)


    if(!chart.options
      || !chart.options.option
      || chart.options.option.xAxis
      || chart.options.option.xAxis.length == 0
    ){
      if(!chart.options)
        chart.options = {}

      if(!chart.options.option)
        chart.options.option = {}

      let graph = {}
      if(chart.options.option.series)
        graph = Object.clone(chart.options.option.series[0])


      if(!chart.axis)
        chart.axis = []

      if(!chart.options.option.title)
        chart.options.option.title = { text : name }

      if(!chart.options.option.legend || !chart.options.option.legend.data)
        chart.options.option.legend = { data: [] }
      /**
      * dynamic, like 'cpus', that is an Array (multiple cores) of Objects and we wanna watch a specific value
      * cpus[0].value[N].times[idle|irq...]
      */
      if(Array.isArray(stat[0].value)
        && chart.watch && chart.watch.value
        && stat[0].value[0][chart.watch.value]
      ){

        let counter = 0
        Array.each(stat, function(d, d_index){
          if(
            !chart.watch.skip
            || (
              d_index == 0
              || (d_index % chart.watch.skip == 0)
              || d_index == d.length - 1
            )
          ){

              // if(!chart.options.dataProvider[counter])
              //   chart.options.dataProvider[counter] = {}
              //
              // chart.options.dataProvider[counter] = {timestamp: d.timestamp}
              //
              // chart.axis[0] = 'timestamp'

              let internal_counter = 0
              Object.each(d.value[0][chart.watch.value], function(tmp, tmp_key){
                if(
                  !chart.watch
                  || !chart.watch.exclude
                  || (chart.watch.exclude && chart.watch.exclude.test(tmp_key) == false)
                ){
                  let v_graph = {}
                  if(chart.options.option.series[internal_counter]){
                    v_graph = chart.options.option.series[internal_counter]
                  }
                  else{
                    v_graph = Object.clone(graph)
                  }

                  v_graph.type = chart.type
                  v_graph.data.push(tmp)
                  chart.options.option.series[internal_counter] = v_graph
                  chart.options.option.legend.data.push(tmp_key)

                  chart.axis[internal_counter + 1] = tmp_key

                  internal_counter++
                }
              })

              counter++

          }
        })


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

          let counter = 0
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

              chart.options.option.xAxis.data.push(new Date(d.timestamp).toLocaleTimeString())

              chart.axis[0] = 'timestamp'

              let internal_counter = 0
              Object.each(obj, function(tmp, tmp_key){
                if(
                  !chart.watch
                  || !chart.watch.exclude
                  || (chart.watch.exclude && chart.watch.exclude.test(tmp_key) == false)
                ){

                  let v_graph = {}
                  if(chart.options.option.series[internal_counter]){
                    v_graph = chart.options.option.series[internal_counter]
                  }
                  else{
                    v_graph = Object.clone(graph)
                  }

                  v_graph.type = chart.type
                  v_graph.data.push(tmp)
                  chart.options.option.series[internal_counter] = v_graph
                  chart.options.option.legend.data.push(tmp_key)

                  chart.axis[internal_counter + 1] = tmp_key

                  internal_counter++

                }
              })

              counter++

            }
          })


        }


      }
      //simple, like 'loadavg', that has 3 columns
      else if(Array.isArray(stat[0].value)){

        let counter = 0
        Array.each(stat, function(d, d_index){
          if(
            !chart.watch.skip
            || (
              d_index == 0
              || (d_index % chart.watch.skip == 0)
              || d_index == d.length - 1
            )
          ){

            chart.options.option.xAxis.data.push(new Date(d.timestamp).toLocaleTimeString())

            Array.each(d.value, function(v, v_index){
              let v_graph = {}
              if(chart.options.option.series[v_index]){
                v_graph = chart.options.option.series[v_index]
              }
              else{
                v_graph = Object.clone(graph)
              }
              v_graph.type = chart.type
              v_graph.data.push(v)
              chart.options.option.series[v_index] = v_graph
              chart.options.option.legend.data.push(name+'_'+v_index)

              chart.axis[v_index + 1] = name+'_'+v_index



            })

            counter++
          }
        })

      }
      //simple, like 'uptime', that has one simple Numeric value
      else if(!isNaN(stat[0].value)){//


        let counter = 0
        Array.each(stat, function(d, d_index){
          if(
            !chart.watch.skip
            || (
              d_index == 0
              || (d_index % chart.watch.skip == 0)
              || d_index == d.length - 1
            )
          ){

            chart.options.option.xAxis.data.push(new Date(d.timestamp).toLocaleTimeString())
            chart.options.option.legend.data.push(name)

            // if(!chart.options.dataProvider[counter])
            //   chart.options.dataProvider[counter] = {}
            //
            // chart.options.dataProvider[counter] = {timestamp: d.timestamp}

            chart.axis[0] = 'timestamp'

            // Array.each(d.value, function(v, v_index){

              let v_graph = {}
              if(chart.options.option.series[0]){
                v_graph = chart.options.option.series[0]
              }
              else{
                v_graph = Object.clone(graph)
              }
              v_graph.type = chart.type
              v_graph.data.push(d.value)
              chart.options.option.series[0] = v_graph

              chart.axis[1] = name


            // })

            counter++



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
    "initOpts": {
      "renderer": "canvas"
    },
    // "lazyUpdate": true,
    "option": {
      "animation": false,
      legend: {
        data:[]
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      "title": {
      //     "text": ""
      },
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      "xAxis": {
          "type": "category",
          boundaryGap : false,
          "splitLine": {
              "show": false
          },
          "data": []
      },
      "yAxis": {
          "type": "value",
          "splitLine": {
              "show": false
          }
      },
      "series": [
        {
          "type": "line",
          "showSymbol": true,
          "hoverAnimation": false,
          "data": [],
          areaStyle: {normal: {}},
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          smooth: true
        }
      ]

		}
  },
  // init: function (vue){
  // },


}
