
module.exports = {
  component: 'amcharts3-wrapper',
  "style": "width:100%; height:200px;",
  // type: 'bar',
  "class": "netdata-chart-with-legend-right netdata-dygraph-chart-with-legend-right",
  "interval": 0,
  watch: {
    skip: 30,//some charts like frappe need to skip values for render performance (dygraph does this automatically)
  },
  pre_process: function(chart, name, stat){


    if(!chart.options
      || !chart.options.dataProvider
    ){
      if(!chart.options)
        chart.options = {}

      if(!chart.options.dataProvider)
        chart.options.dataProvider = []

      let graph = {}
      if(chart.options.graphs[0])
        graph = Object.clone(chart.options.graphs[0])


      if(!chart.axis)
        chart.axis = []

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

              if(!chart.options.dataProvider[counter])
                chart.options.dataProvider[counter] = {}

              chart.options.dataProvider[counter] = {timestamp: d.timestamp}

              chart.axis[0] = 'timestamp'

              let internal_counter = 0
              Object.each(d.value[0][chart.watch.value], function(tmp, tmp_key){
                let v_graph = {}
                if(chart.options.graphs[internal_counter]){
                  v_graph = chart.options.graphs[internal_counter]
                }
                else{
                  v_graph = Object.clone(graph)
                }
                v_graph.id = tmp_key
                v_graph.valueField = tmp_key
                v_graph.title = tmp_key
                chart.options.graphs[internal_counter] = v_graph

                chart.options.dataProvider[counter][tmp_key] = tmp
                chart.axis[internal_counter + 1] = tmp_key



                internal_counter++
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
        // //console.log('pre_process frappe-charts-wrapper', chart, name, stat)

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

              if(!chart.options.dataProvider[counter])
                chart.options.dataProvider[counter] = {}

              chart.options.dataProvider[counter] = {timestamp: d.timestamp}

              chart.axis[0] = 'timestamp'

              let internal_counter = 0
              Object.each(obj, function(tmp, tmp_key){
                if(
                  !chart.watch
                  || !chart.watch.exclude
                  || (chart.watch.exclude && chart.watch.exclude.test(tmp_key) == false)
                ){

                  let v_graph = {}
                  if(chart.options.graphs[internal_counter]){
                    v_graph = chart.options.graphs[internal_counter]
                  }
                  else{
                    v_graph = Object.clone(graph)
                  }
                  v_graph.id = tmp_key
                  v_graph.valueField = tmp_key
                  v_graph.title = tmp_key
                  chart.options.graphs[internal_counter] = v_graph

                  chart.options.dataProvider[counter][tmp_key] = tmp
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

            if(!chart.options.dataProvider[counter])
              chart.options.dataProvider[counter] = {}

            chart.options.dataProvider[counter] = {timestamp: d.timestamp}

            chart.axis[0] = 'timestamp'

            Array.each(d.value, function(v, v_index){

              let v_graph = {}
              if(chart.options.graphs[v_index]){
                v_graph = chart.options.graphs[v_index]
              }
              else{
                v_graph = Object.clone(graph)
              }
              v_graph.id = name+'_'+v_index
              v_graph.valueField = name+'_'+v_index
              v_graph.title = name+'_'+v_index
              chart.options.graphs[v_index] = v_graph

              chart.options.dataProvider[counter][name+'_'+v_index] = v
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

            if(!chart.options.dataProvider[counter])
              chart.options.dataProvider[counter] = {}

            chart.options.dataProvider[counter] = {timestamp: d.timestamp}

            chart.axis[0] = 'timestamp'

            // Array.each(d.value, function(v, v_index){

              let v_graph = {}
              if(chart.options.graphs[0]){
                v_graph = chart.options.graphs[0]
              }
              else{
                v_graph = Object.clone(graph)
              }
              v_graph.id = name
              v_graph.valueField = name
              v_graph.title = name
              chart.options.graphs[0] = v_graph

              chart.options.dataProvider[counter][name] = d.value
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

    // //console.log('pre_process frappe-charts-wrapper', chart, name)

    return chart
  },
  "options": {
    "path": "dist/amcharts/",
    "type": "serial",
    "theme": "light",

    // "marginRight": 80,
    // "autoMarginOffset": 20,
    // "marginTop": 7,
    "legend": {
      "horizontalGap": 10,
      "maxColumns": 1,
      "position": "right",
  		"useGraphSettings": true,
  		"markerSize": 10
    },

    "valueAxes": [{
        "axisAlpha": 0.2,
        "dashLength": 1,
        "position": "left"
    }],
    "mouseWheelZoomEnabled": true,
    "graphs": [
      {
        "id": undefined,
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "hideBulletsCount": 50,
        "title": undefined,
        "valueField": undefined,
        "useLineColorForBulletBorder": true,
        "balloon":{
            "drop":true
        }
      },
    ],
    // "chartScrollbar": {
    //     "autoGridCount": true,
    //     "graph": "g1",
    //     "scrollbarHeight": 40
    // },
    // "chartCursor": {
    //    "limitToGraph":"g1"
    // },
    "categoryField": "timestamp",
    "categoryAxis": {
        "parseDates": true,
        "minPeriod": "ss",//seconds
        // "dateFormats": [{period:'ss',format:'JJ:NN:SS'}],
        "axisColor": "#DADADA",
        "dashLength": 1,
        "minorGridEnabled": true
    },
    // "export": {
    //     "enabled": true
    // }
  },
  "init": function(vm, chart, type){
    if(type == 'amcharts3'){
      chart.ignoreZoomed = false;
      chart.addListener("zoomed", function(event) {
        if (chart.ignoreZoomed) {
          chart.ignoreZoomed = false;
          return;
        }
        chart.zoomStartDate = event.startDate;
        chart.zoomEndDate = event.endDate;
      });

      chart.addListener("dataUpdated", function(event) {
        //console.log('chart.zoomStartDate',chart.zoomStartDate);
        //console.log('chart.zoomEndDate', chart.zoomEndDate);
        if(chart.zoomStartDate != chart.zoomEndDate)
          chart.zoomToDates(chart.zoomStartDate, chart.zoomEndDate);
      });
    }
  },


}
