let DefaultVGauge = require('./vGauge')

const mootools = require("mootools")

let debug = require('debug')('mngr-ui-admin-charts:defaults:vGauge.derived'),
    debug_internals = require('debug')('mngr-ui-admin-charts:defaults:vGauge.derived:Internals');

debug.log = console.log.bind(console)
debug_internals.log = console.log.bind(console)

module.exports = Object.merge(Object.clone(DefaultVGauge),{

  /**
  * @var: save prev cpu data, need to calculate current cpu usage
  **/
  prev: [],
  watch: {
    /**
    * @trasnform: diff between each value against its prev one
    */
    transform: function(values, caller, chart, cb){
      let isWindow = (caller && caller.setInterval) ? true : false
      debug_internals('transform', isWindow, caller, values, chart, cb)
      /**
      * node-tabular-data/data_to_tabular (used on chart.vue) call this tranform too, avoid runnin it
      * Let it trasnform stat to tabular with generic methods
      * Run this one with only with tabular data
      **/
      if(isWindow){
        /**
        * gauges use only one value, so we keep 'last' one, the one with biggest timestamp
        * sort in desc order
        **/
        if(values && Array.isArray(values)){
          values.sort(function (a, b) { return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0) })
          values = [values[0],values[1]]
        }

        debug_internals('transform2 %o', values)

      }
      // else{
      // }

      return values
    },
  },

})
