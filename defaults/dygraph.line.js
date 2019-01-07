// import Dygraph from 'dygraphs'

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
      axisLabelFontSize: 11,

      highlightCallback: function(event, x, points, row, seriesName){
        window.EventBus.$emit('highlightCallback', [event, x, points, row, seriesName])
      },
      unhighlightCallback: function(event){
        window.EventBus.$emit('unhighlightCallback', event)
      },
      drawGrid: true,
      labelsSeparateLines: true,
      "hideOverlayOnMouseOut": false,
      "labelsDiv": "netdata-chart-legend",
      "legend": "always",
      connectSeparatedPoints: true,
      // connectSeparatedPoints: false,
      includeZero: true,
      fillGraph: true,
      showRoller: false,

      /**
      * netdata options
      */
      rightGap: 5,
      xRangePad: 1,
      yRangePad: 1,
      pixelRatio: 1,
      drawGapEdgePoints: true,
      stepPlot: false,
      gridLinePattern: null,
      gridLineWidth: 1.0,
      maxNumberWidth: 8,
      sigFigs: null,
      digitsAfterDecimal: 2,
      // labelsDivStyles: { 'fontSize':'1px' },
      // labelsDivWidth: self.data('dygraph-labelsdivwidth') || state.chartWidth() - 70,
      labelsSeparateLines: true,
      labelsShowZeroValues: true,
      axes: {
          x: {
              pixelsPerLabel: 50,
              // ticker: Dygraph.dateTicker,
      //         // axisLabelFormatter: function (d, gran) {
      //         //     return NETDATA.zeropad(d.getHours()) + ":" + NETDATA.zeropad(d.getMinutes()) + ":" + NETDATA.zeropad(d.getSeconds());
      //         // },
              valueFormatter: function (ms) {
                  var d = new Date(ms);
                  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
                  // return NETDATA.zeropad(d.getHours()) + ":" + NETDATA.zeropad(d.getMinutes()) + ":" + NETDATA.zeropad(d.getSeconds());
              }
          },
          y: {
              pixelsPerLabel: 15,
      //         valueFormatter: function (x) {
      //             // we format legends with the state object
      //             // no need to do anything here
      //             // return (Math.round(x*100) / 100).toLocaleString();
      //             // return state.legendFormatValue(x);
      //             return x;
              // }
          }
      },
      /**
      * netdata white theme
      **/
      axisLineColor: '#CCCCCC',
      strokeBorderColor: '#FFFFFF',
      gridLineColor: '#DDDDDD',
      colors: [
        '#3366CC', '#DC3912',   '#109618', '#FF9900',   '#990099', '#DD4477',
        '#3B3EAC', '#66AA00',   '#0099C6', '#B82E2E',   '#AAAA11', '#5574A6',
        '#994499', '#22AA99',   '#6633CC', '#E67300',   '#316395', '#8B0707',
        '#329262', '#3B3EAC'
      ],
      /**
      * netdata white theme
      **/

      /**
      * netdata white theme
      **/

      /**
      * netdata slate theme
      **/
      // axisLineColor: '#373b40',
      // strokeBorderColor: '#272b30',
      // gridLineColor: '#373b40',
      // colors: [
      //   '#66AA00', '#FE3912',   '#3366CC', '#D66300',   '#0099C6', '#DDDD00',
      //   '#5054e6', '#EE9911',   '#BB44CC', '#e45757',   '#ef0aef', '#CC7700',
      //   '#22AA99', '#109618',   '#905bfd', '#f54882',   '#4381bf', '#ff3737',
      //   '#329262', '#3B3EFF'
      // ],


      /**
      * netdata options
      */


    }
  }
