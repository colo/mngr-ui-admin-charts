let DefaultDygraphLine = require('../defaults/dygraph.line')

let debug = require('debug')('mngr-ui-admin-charts:os.mounts.blocks'),
    debug_internals = require('debug')('mngr-ui-admin-charts:os.mounts.blocks:Internals');

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{

  watch: {
    // // merge: true,
    // value: undefined,
    // /**
    // * @trasnform: diff between each value against its prev one
    // */
    transform: function(values, vm, chart, cb){

      values = Array.clone(values)
      // let transformed = []
     //
     Array.each(values, function(val, index){
       // let transform = { timestamp: val.timestamp, value: (val.value / 1024) / 1024 }
       // transformed.push(transform)
       // val[1] = Math.round(val[1] / 1024 / 1024)
       // val.pop()
       val[2] = undefined //remove 'total'
       values[index] = val.clean()
     })

     debug('trasnform', values)
     return values
    }
  },
  init: function (vm, chart, name, stat, type){
    debug('init', name, stat, type)
    stat = Array.clone(stat)
    if(type === 'chart'){
      let total
      if(Array.isArray(stat)){
        // free = stat[0].value[1]
        total = stat[0].value[2]
      }
      else{
        total = stat.value[2]
      }

      chart.options.valueRange = [
        0,
        total
      ]
    }


  },
  "options": {
    labels: ['Time', 'available', 'used'],
    // fillGraph: true,
    // fillAlpha: 0.5,
    // strokeWidth:1,
    valueRange: [],
    stackedGraph: true,
  }
})
