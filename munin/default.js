
let debug = require('debug')('mngr-ui-admin-charts:munin')
let debug_internals = require('debug')('mngr-ui-admin-charts:munin:Internals')


let DefaultDygraphLine = require('../defaults/dygraph.line')

let allowed_names = /cpu|mem|elapsed|time|count/
module.exports = Object.merge(Object.clone(DefaultDygraphLine),{
  pre_process: function(chart, name, stat){
    debug_internals('pre_process %s %o', name, stat)
    return chart
  },
  top: {
    count: 5,
    pids: []
  },

  "options": {
    // valueRange: [0, 100],
    labels: ['Time'],
  },
  // "options": undefined,
  // match: /^os_procs_stats$/,
  // match: /^[a-zA-Z0-9_]*$/,

  // type: /^os_procs_(.*?)_stats\.top$/,

  watch: {

    value: undefined,

    transform: function(values, caller, chart, cb){
      debug_internals('transform %o %s %s', values, chart.name, chart.path)

      // // if(allowed_names.test(chart.name)){
      // //   let matched_type = chart.type.exec(chart.path)
      // //   if(Array.isArray(matched_type)){
      // //     matched_type = matched_type[1]
      // //   }
      // //   else{
      // //     matched_type = 'pid'
      // //   }
      // //
      // //   debug_internals('transform %s %s %s', chart.path, chart.name, matched_type)
      // //
      // //   // //console.log('os_procs_stats_percentage_mem transform', values)
      //   let transformed = []
      // //
      //   for(let index = 0; index < values.length; index++){
      //     // // let transform_value = []
      //     // let val = values[index]
      //     //
      //     //
      //     // // let length = val.value.length
      //     // // val.value.splice(
      //     // //   (chart.top * -1) -1,
      //     // //   length - chart.top
      //     // // )
      //     // //
      //     // // self.$set(self.available_charts[self.host+'.os_procs_stats_percentage_mem'].chart.options, 'labels', ['Time'])
      //     // //
      //     // if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
      //     //   Array.each(val.value, function(data, data_index){
      //     //     debug_internals('val.value %o', data)
      //     //
      //     //     if(chart.options.labels.length < chart.top.count){
      //     //       // chart.options.labels[index + 1] = 'pid['+data.pid+']'
      //     //       chart.options.labels.push(matched_type+'['+data[matched_type]+']')
      //     //       chart.top.pids.push(data[matched_type])
      //     //     }
      //     //
      //     //   })
      //     //
      //     //   chart.options.labels.push(matched_type+'[others]')
      //     // }
      //     //
      //     // let transform_value = new Array(chart.options.labels.length - 1)
      //     // transform_value.fill(0)
      //     //
      //     //
      //     // let _others_index = chart.options.labels.length - 2 //remember, first label is Time
      //     // Array.each(val.value, function(data, data_index){
      //     //   let _index = chart.top.pids.indexOf(data[matched_type])
      //     //   if(_index > -1){
      //     //     transform_value[_index] = data[chart.name]
      //     //   }
      //     //   else{
      //     //     transform_value[_others_index] = (!transform_value[_others_index]) ? data[chart.name] : transform_value[_others_index] + data[chart.name]
      //     //   }
      //     // })
      //     //
      //     // if(!transform_value[_others_index])
      //     //   transform_value[_others_index] = 0
      //     //
      //     // let transform = {timestamp: val.timestamp, value: transform_value}
      //     //
      //     // transformed.push(transform)
      //     //
      //     if(index == values.length -1){
      //       // //console.log('transformed: ', transformed)
      //       debug_internals('transform %o %s', transformed, chart.name)
      //       cb( transformed )
      //     }
      //   }
      // //
      // // }
      // // else{
      //   // cb( [] )
      // // }
      cb( [{timestamp: 0, value: 0}] )
    }
  }
})
