let debug = require('debug')('mngr-ui-admin-charts:defaults:base'),
    debug_internals = require('debug')('mngr-ui-admin-charts:defaults:base:Internals');

debug.log = console.log.bind(console)
debug_internals.log = console.log.bind(console)


module.exports = {
    // "style": "width:100%; height:154px;",
    // "class": "netdata-chart-with-legend-right netdata-dygraph-chart-with-legend-right",
    "interval": undefined,
    "skip": undefined,

    watch: {
      // merge: true,
      // cumulative: true,
      // value: 'times',
      // managed: true,
      /**
      * @trasnform: diff between each value against its prev one
      */
      transform: function(values, caller, chart, cb){
        debug('transform', values, caller, chart, cb)

        let isWindow = (caller && caller.setInterval) ? true : false
        /**
        * node-tabular-data/data_to_tabular (used on chart.vue) call this tranform too, avoid runnin it
        * Let it trasnform stat to tabular with generic methods
        * Run this one with only with tabular data
        **/
        if(isWindow === true){

        }
        else{

        }

        return values
      }
    },
    pre_process: function(chart, name, stat){
      debug('pre_process', chart, name, stat)
      return chart
    },
    init: function (vm, chart, name, stat, type){
      debug('init', vm, chart, name, stat, type)

    },

    "options": {},
    "props": {}
  }
