// const jsEnv = require('browser-or-node');
//
// // if (jsEnv.isBrowser) {
// //   // do browser only stuff
// // }
//
// if (jsEnv.isNode) {
//   const Window = require('window')
//   global.window = new Window()
// }
//
//
//
// const Dygraph = require('dygraphs')

module.exports = {
    component: 'dygraph-wrapper',
    //"style": "width:100%; height:180px;",
    "style": "width:100%; height:154px;",
    "class": "netdata-chart-with-legend-right netdata-dygraph-chart-with-legend-right",
    "interval": undefined,
    "skip": undefined,
    // init: function (vm, chart, name, stat, type ){
    //   // ////console.log('init', vue)
    //   this.$vm = vue
    //   // EventBus.$emit('cpu', doc) //update cpu widget
    // },
    pre_process: function(chart, name, stat){

      if(!chart.options || !chart.options.labels){
        if(!chart.options)
          chart.options = {}

        chart.options.labels = []

        /**
        * dynamic, like 'cpus', that is an Array (multiple cores) of Objects and we wanna watch a specific value
        * cpus[0].value[N].times[idle|irq...]
        */
        if(Array.isArray(stat[0].value)
          && chart.watch && chart.watch.value
          && stat[0].value[0][chart.watch.value]
        ){


          // //console.log('Array.isArray(stat[0].value)', stat[0].value)
          Object.each(stat[0].value[0][chart.watch.value], function(tmp, tmp_key){
            if(
              !chart.watch
              || !chart.watch.exclude
              || (chart.watch.exclude && chart.watch.exclude.test(tmp_key) == false)
            )
              chart.options.labels.push(tmp_key)
          })

          chart.options.labels.unshift('Time')

        }
        /**
        * dynamic, like 'blockdevices', that is an Object and we wanna watch a specific value
        * stat[N].value.stats[in_flight|io_ticks...]
        */
        else if(isNaN(stat[0].value) && !Array.isArray(stat[0].value)){//an Object

          //if no "watch.value" property, everything should be manage on "trasnform" function
          if(
            chart.watch && chart.watch.managed != true
            || !chart.watch

            // && chart.watch.value
          ){
            let obj = {}
            // if(chart.watch && chart.watch.value){
            //   obj = stat[0].value[chart.watch.value]
            // }
            // else{
            //   obj = stat[0].value
            // }

            if(chart.watch && chart.watch.value){

              if(Array.isArray(chart.watch.value)){
      					// chart_watch_value = chart.watch.value.split('/')
                if(chart.watch.value[0] instanceof RegExp){
                  Object.each(stat[0].value, function(val, key){
                    /**
                    * watch out to have a good RegExp, or may keep matching 'til last one
                    **/
                    if(chart.watch.value[0].test(key)) obj[key] = stat[0].value[key]
                      // obj = stat[0].value[key]
                  })
                }
                else{
                  obj = stat[0].value[chart.watch.value[0]]
                }

                // Array.each(chart.watch.value.split('/'), function(sub_key, index){
                //   if(index != 0 && obj[sub_key])
                //     obj = obj[sub_key]
                // })

      				}
              else{
                  obj = stat[0].value[chart.watch.value]
              }


            }
            else{
              obj = stat[0].value
            }

            if(obj && obj !== null)
              Object.each(obj, function(tmp, tmp_key){
                if(
                  !chart.watch
                  || !chart.watch.exclude
                  || (chart.watch.exclude && chart.watch.exclude.test(tmp_key) == false)
                )

                  chart.options.labels.push(tmp_key)
              })

            chart.options.labels.unshift('Time')
            //console.log('chart.options.labels', name, chart.options.labels)

          }
          // else if (
          //   ! chart.watch
          //   || !chart.watch.value
          // ) {//like minute.loadavg|cpus|etc...
          // // else{
          //
          //   //console.log('pre_process ', chart, name, stat)
          //
          //   Object.each(stat[0].value, function(tmp, tmp_key){
          //     if(!chart.watch || chart.watch.exclude.test(tmp_key) == false)
          //       chart.options.labels.push(tmp_key)
          //   })
          //
          //   chart.options.labels.unshift('Time')
          //
          // }
        }
        //simple, like 'loadavg', that has 3 columns
        else if(Array.isArray(stat[0].value)){

          chart.options.labels = ['Time']

          for(let i= 0; i < stat[0].value.length; i++){//create data columns
            chart.options.labels.push(name+'_'+i)
          }


          // this.process_chart(chart, name)
        }
        //simple, like 'uptime', that has one simple Numeric value
        else if(!isNaN(stat[0].value)){//
          chart.options.labels = ['Time']

          chart.options.labels.push(name)
          // this.process_chart(chart, name)
        }

        else{
          chart = null
        }
      }

      // //console.log('pre_process)', name, chart)

      return chart
    },

    "options": {
      // pixelRatio: 1,

      highlightCallback: function(event, x, points, row, seriesName){
        window.EventBus.$emit('highlightCallback', [event, x, points, row, seriesName])
      },
      unhighlightCallback: function(event){
        window.EventBus.$emit('unhighlightCallback', event)
      },

      /**
      * NETDATA
      **/

      /**
      * netdata white theme
      **/
      // axisLineColor: self.data('dygraph-axislinecolor') || NETDATA.themes.current.axis,
      // strokeBorderColor: self.data('dygraph-strokebordercolor') || NETDATA.themes.current.background,
      // gridLineColor: self.data('dygraph-gridlinecolor') || NETDATA.themes.current.grid,
      // axisLineColor: '#F0F0F0',
        axisLineColor: '#A0A0A0',
        strokeBorderColor: '#FFFFFF',
        // gridLineColor: '#F0F0F0',
        gridLineColor: '#A0A0A0',
      colors: [
        '#3366CC', '#DC3912', '#109618', '#FF9900', '#990099', '#DD4477',
        '#3B3EAC', '#66AA00', '#0099C6', '#B82E2E', '#AAAA11', '#5574A6',
        '#994499', '#22AA99', '#6633CC', '#E67300', '#316395', '#8B0707',
        '#329262', '#3B3EAC'
      ],

      /**
      * netdata slate theme
      **/
      // axisLineColor: '#283236',
      // strokeBorderColor: '#272b30',
      // gridLineColor: '#283236',
      // colors: [
      //   '#66AA00', '#FE3912', '#3366CC', '#D66300', '#0099C6', '#DDDD00',
      //   '#5054e6', '#EE9911', '#BB44CC', '#e45757', '#ef0aef', '#CC7700',
      //   '#22AA99', '#109618', '#905bfd', '#f54882', '#4381bf', '#ff3737',
      //   '#329262', '#3B3EFF'
      // ],

      rightGap: 5,
      showRangeSelector: false,
      showRoller: false,

      title: undefined,
      titleHeight: 19,

      legend: 'always', // 'onmouseover',
      // labels: data.result.labels,
      labelsDiv: "netdata-chart-legend",
      // labelsDivStyles: { 'fontSize':'1px' },
      // labelsDivWidth: self.data('dygraph-labelsdivwidth') || state.chartWidth() - 70,
      labelsSeparateLines: true,
      labelsShowZeroValues: true,
      labelsKMB: false,
      labelsKMG2: false,
      showLabelsOnHighlight: true,
      hideOverlayOnMouseOut: true, //false

      includeZero: false, //true
      xRangePad: 0, //1
      yRangePad: 1,

      valueRange: null,

      // ylabel: state.units,
      yLabelWidth: 12,

      // the function to plot the chart
      plotter: null,

      // The width of the lines connecting data points. This can be used to increase the contrast or some graphs.
      // strokeWidth: self.data('dygraph-strokewidth') || strokeWidth,
      strokePattern: undefined,

      // The size of the dot to draw on each point in pixels (see drawPoints). A dot is always drawn when a point is "isolated",
      // i.e. there is a missing point on either side of it. This also controls the size of those dots.
      drawPoints: false,

      // Draw points at the edges of gaps in the data. This improves visibility of small data segments or other data irregularities.
      drawGapEdgePoints: true,

      connectSeparatedPoints: false, //true
      pointSize: 1,

      // enabling this makes the chart with little square lines
      stepPlot: false,

      // Draw a border around graph lines to make crossing lines more easily distinguishable. Useful for graphs with many lines.

      // strokeBorderWidth: self.data('dygraph-strokeborderwidth') || (chart_type === 'stacked')?0.0:0.0,

      fillGraph: false, //true
      // fillGraph: self.data('dygraph-fillgraph') || (chart_type === 'area' || chart_type === 'stacked')?true:false,
      // fillAlpha: self.data('dygraph-fillalpha') || (chart_type === 'stacked')?NETDATA.options.current.color_fill_opacity_stacked:NETDATA.options.current.color_fill_opacity_area,
      // stackedGraph: self.data('dygraph-stackedgraph') || (chart_type === 'stacked')?true:false,
      stackedGraphNaNFill: 'none',

      drawAxis: true,
      axisLabelFontSize: 10, //11

      axisLineWidth: 0.3,

      drawGrid: true,
      // drawXGrid: undefined,
      // drawYGrid: undefined,
      gridLinePattern: null,
      // gridLineWidth: 0.3, //1.0


      maxNumberWidth: 8,
      sigFigs: null,
      // digitsAfterDecimal: 2,
      valueFormatter: function(x){ return x.toFixed(2); },

      // highlightCircleSize: self.data('dygraph-highlightcirclesize') || highlightCircleSize,
      highlightSeriesOpts: null, // TOO SLOW: { strokeWidth: 1.5 },
      highlightSeriesBackgroundAlpha: null, // TOO SLOW: (chart_type === 'stacked')?0.7:0.5,

      pointClickCallback: undefined,
      // visibility: state.dimensions_visibility.selected2BooleanArray(state.data.dimension_names),

      /**
      * new values
      **/
      digitsAfterDecimal: 16,
      strokeWidth: 1.5,
      // pixelRatio: null,
      pixelRatio: 1,
      strokeBorderWidth: 0.0,
      gridLineWidth: 0.1,
      /** end new **/

      axes: {
          x: {
              pixelsPerLabel: 50,
              // ticker: Dygraph.dateTicker,
              axisLabelFormatter: function (d, gran) {
                  // return NETDATA.zeropad(d.getHours()) + ":" + NETDATA.zeropad(d.getMinutes()) + ":" + NETDATA.zeropad(d.getSeconds());
                  return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
              },
              valueFormatter: function (ms) {
                  var d = new Date(ms);
                  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
              }
          },
          y: {
              pixelsPerLabel: 15,
              valueFormatter: function (x) {
                  // we format legends with the state object
                  // no need to do anything here
                  // return (Math.round(x*100) / 100).toLocaleString();
                  // return state.legendFormatValue(x);
                  return x;
              }
          }
      },

    }
  }
