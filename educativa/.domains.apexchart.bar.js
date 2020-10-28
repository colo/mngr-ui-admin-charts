let DefaultApexchartBar = require('../defaults/apexchart.bar')

const mootools = require("mootools")

let debug = require('debug')('mngr-ui-admin-charts:educativa:domains.apexchart.bar'),
    debug_internals = require('debug')('mngr-ui-admin-charts:educativa:domains.apexchart.bar:Internals');

debug.log = console.log.bind(console)
debug_internals.log = console.log.bind(console)

// const roundMilliseconds = function (timestamp) {
//   let d = new Date(timestamp)
//   d.setMilliseconds(0)
//
//   return d.getTime()
// }
//
// const roundSeconds = function (timestamp) {
//   timestamp = roundMilliseconds(timestamp)
//   let d = new Date(timestamp)
//   d.setSeconds(0)
//
//   return d.getTime()
// }
//

module.exports = Object.merge(Object.clone(DefaultApexchartBar),{

  watch: {
    managed: true,
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


        let series = {}

        Array.each(values, function(value, index){
          // let d = new Date(value.timestamp * 1)
          // // debug('transform %o', value)
          // let label = [d.getHours(),d.getMinutes(),d.getSeconds()].join(':')
          // chart.options.labels.push(label)
          chart.options.labels.push(value.timestamp)

          Object.each(value.value, function(count, domain){
            if(!series[domain]) series[domain] = {name: domain, data: []}

            series[domain].data.push(count)
          })
        })

        debug('transformed', Object.values(series))
        cb('domain', Object.values(series))
      }
      else{
        return values
      }
    }
  },

  init: function (vm, chart, name, stat, type){
    debug('init', vm, chart, name, stat, type)

  },

  options: {
    xaxis: {
      type: undefined,
      labels: {
        formatter: function (value, timestamp) {
          // debug('formatter', value, timestamp)
          // return new Date(timestamp) // The formatter function overrides format property
          let d = new Date(timestamp * 1)
          // debug('transform %o', value)
          return [d.getHours(),d.getMinutes(),d.getSeconds()].join(':')
        },
      }
    },
  }

})
