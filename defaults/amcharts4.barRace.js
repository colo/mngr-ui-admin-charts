let DefaultAmcharts4 = require('./amcharts4')

const mootools = require("mootools")

let debug = require('debug')('mngr-ui-admin-charts:defaults:amcharts4.barRace'),
    debug_internals = require('debug')('mngr-ui-admin-charts:defaults:amcharts4.barRace:Internals');

debug.log = console.log.bind(console)
debug_internals.log = console.log.bind(console)

module.exports = Object.merge(Object.clone(DefaultAmcharts4),{

  // watch: {
  //   // skip: 15,//some charts like frappe need to skip values for render performance (dygraph does this automatically)
  //   managed: true,
  //   /**
  //   * @trasnform: diff between each value against its prev one
  //   */
  //   transform: function(values, caller, chart, cb){
  //     // debug('transform %s %o', caller, values, chart, cb)
  //
  //     let isWindow = (caller && caller.setInterval) ? true : false
  //     /**
  //     * node-tabular-data/data_to_tabular (used on chart.vue) call this tranform too, avoid runnin it
  //     * Let it trasnform stat to tabular with generic methods
  //     * Run this one with only with tabular data
  //     **/
  //     let data = { labels: [], datasets: [] }
  //
  //     if(isWindow === true){
  //     }
  //     else{
  //       return values
  //     }
  //
  //
  //   }
  // },

  init: function (vm, chart, name, stat, type){

  },
  props:{
    categoryY: 'type',
    valueX: 'time',
    label: '',
    /* label: (sum === true) ? 'Per CGI count (sum)' : 'Per CGI count', */
    zoom: function (data, categoryY, valueX) {
      const min_zoom = 0.5
      const max_zoom = 1
      /* const min_length = 8 */
      const max_length = 15
      let length = data.length
      /* let zoom = 1 */

      if (data.length <= max_length) {
        return max_zoom
      } else {
        return (max_length / data.length < min_zoom) ? min_zoom : max_length / data.length
      }
    },
    /* colorScheme: colorScheme,
    dark: dark, */
    sum: false
  }
  

})
