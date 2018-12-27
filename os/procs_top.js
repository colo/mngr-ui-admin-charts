
let debug = require('debug')('mngr-ui-admin-charts:os:procs_top')
let debug_internals = require('debug')('mngr-ui-admin-charts:os:procs_top:Internals')

// let DefaultDygraphLine = require('../defaults/dygraph.line')
//
// module.exports = Object.merge(Object.clone(DefaultDygraphLine),{
//
//   pre_process: function(chart, name, stat){
//     // console.log('procs_top pre_process', name, stat)
//     // let count = 1
//     // while(count <= chart.top){
//     //   chart.options.labels.push(count)
//     // }
//     //let count = 1
//     //while(count <= chart.top){
//       //chart.options.labels.push('top '+count)
//       //count++
//     //}
//     return chart
//   },
//   "options": {
//     labels: ['Time'],
//   },
//   match: /^[a-zA-Z0-9_]*$/,
//   /**
//   * @var: save prev cpu data, need to calculate current cpu usage
//   **/
//   //prev: {timestamp: 0, value: { times: {} } },
//   top: 5,
//   watch: {
//     // merge: true,
//     // cumulative: true,
//     value: undefined,
//     // filters: [{
//     //   type: /ext.*/
//     // }],
//     /**
//     * @trasnform: diff between each value against its prev one
//     */
//     transform: function(values, caller, chart, cb){
//
//       // values.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )
//
// 			// console.log('procs_top transform: ', values)
//
//       let transformed = []
//
//       for(let index = 0; index < values.length; index++){
//         let pre_transformed = []
//         let val = values[index]
//         // transformed.push({timestamp: val.timestamp, value: Object.keys(val.value).length})
//         Object.each(val.value, function(data, uid){
//           // console.log('pre transformed: ', data)
//           pre_transformed.push({count: data.count, uid: uid})
//
//         })
//         pre_transformed.sort(function(a,b) {return (a.count > b.count) ? 1 : ((b.count > a.count) ? -1 : 0);} )
//         let length = pre_transformed.length
//         pre_transformed.splice(
//           (chart.top * -1) -1,
//           length - chart.top
//         )
//
//         pre_transformed.reverse()
//         let count = 0
//         let value = []
//         while(count < pre_transformed.length){
//           value.push(pre_transformed[count].count)
//           chart.options.labels[count + 1] = 'uid['+pre_transformed[count].uid+']'
//           // transformed.push({timestamp: val.timestamp, value: pre_transformed[i]})
//           count++
//         }
//         transformed.push({timestamp: val.timestamp, value: value})
//         // console.log('pre transformed: ', pre_transformed)
//
//         // console.log('pre transformed: ', Object.keys(val.value).length)
//         // pre_transformed.push({count: Object.keys(val.value).length, uid: })
//         if(index == values.length -1){
//
//           // pre_transformed.sort(function(a,b) {return (a.count > b.count) ? 1 : ((b.count > a.count) ? -1 : 0);} )
//           // console.log('transformed: ', transformed)
//           cb( transformed )
//         }
//       }
//
//       //console.log('transformed: ', transformed)
//
//     }
//   }
//
// })

let DefaultDygraphLine = require('../defaults/dygraph.line')

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{
  pre_process: function(chart, name, stat){
    debug_internals('os_procs_stats pre_process %o %s %o', chart, name, stat)

    return chart
  },
  top: {
    count: 5,
    pids: []
  },

  "options": {
    valueRange: [0, 100],
    labels: ['Time'],
  },
  // "options": undefined,
  match: /^os_procs_stats$/,
  // match: /^[a-zA-Z0-9_]*$/,
  watch: {

    value: undefined,
    transform: function(values, caller, chart, cb){
      debug_internals('os_procs_stats_percentage_mem transform %o', values)

      // //console.log('os_procs_stats_percentage_mem transform', values)
      let transformed = []

      for(let index = 0; index < values.length; index++){
        // let transform_value = []
        let val = values[index]


        // let length = val.value.length
        // val.value.splice(
        //   (chart.top * -1) -1,
        //   length - chart.top
        // )
        //
        // self.$set(self.available_charts[self.host+'.os_procs_stats_percentage_mem'].chart.options, 'labels', ['Time'])
        //
        if(chart.options.labels.length == 1){//process for the first time only, if you wanna re process, you need to reload
          Array.each(val.value, function(data, data_index){
            // //console.log('pre transformed: ', data)
            // if(index < chart.top)
            //   transform_value.push(data['pid']*1)

            if(chart.options.labels.length < chart.top.count){
              // chart.options.labels[index + 1] = 'pid['+data.pid+']'
              chart.options.labels.push('pid['+data['pid']+']')
              chart.top.pids.push(data['pid'])
            }

          })

          chart.options.labels.push('pid[others]')
        }

        let transform_value = new Array(chart.options.labels.length - 1)
        transform_value.fill(0)


        let _others_index = chart.options.labels.length - 2 //remember, first label is Time
        Array.each(val.value, function(data, data_index){
          let _index = chart.top.pids.indexOf(data['pid'])
          if(_index > -1){
            transform_value[_index] = data['%mem']
          }
          else{
            transform_value[_others_index] = (!transform_value[_others_index]) ? data['%mem'] : transform_value[_others_index] + data['%mem']
          }
        })

        if(!transform_value[_others_index])
          transform_value[_others_index] = 0

        let transform = {timestamp: val.timestamp, value: transform_value}

        transformed.push(transform)

        if(index == values.length -1){
          // //console.log('transformed: ', transformed)
          cb( transformed )
        }
      }
    }
  }
})
