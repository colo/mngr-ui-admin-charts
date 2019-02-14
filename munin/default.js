
let debug = require('debug')('mngr-ui-admin-charts:munin')
let debug_internals = require('debug')('mngr-ui-admin-charts:munin:Internals')


let DefaultDygraphLine = require('../defaults/dygraph.line')

// let allowed_names = /cpu|mem|elapsed|time|count/
let cumulative = /forks|fw\.packets|mysql\.network\.traffic|mysql\.select\.types|mysql\.bytes|mysql\.connections|nginx\.request/
let cumulative_negative = /mysql\.bytes\.recv|mysql\.network\.traffic\.Bytesreceived|fw\.packets\.received/

let negative = {
  'munin.swap': ['swapout']
}

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{
  // pre_process: function(chart, name, stat){
  //   // debug_internals('pre_process %s %s %s', name, chart.name, chart.path)
  //
  //   return chart
  // },
  // // top: {
  // //   count: 5,
  // //   pids: []
  // // },
  //
  // // "options": {
  // //   // valueRange: [0, 100],
  // //   labels: ['Time'],
  // // },
  // // "options": undefined,
  // // match: /^os_procs_stats$/,
  // // match: /^[a-zA-Z0-9_]*$/,
  //
  // // type: /^os_procs_(.*?)_stats\.top$/,
  prev: {timestamp: 0, value: 0 },

  watch: {

    value: undefined,

    transform: function(values, caller, chart, cb){
      debug_internals('transform %o %s %s', values, chart.name)

      // if(chart.path == 'munin.memory'){
      //   chart.style = "width:100%; height:220px;"
      // }

      if(cumulative.test(chart.name)){
        let transformed = []
        for(let index = 0; index < values.length; index++){
          let val = values[index]

          if(
            chart.prev.timestamp == 0
            || chart.prev.timestamp > val.timestamp
          ){
            chart.prev = Object.clone(val)
          }
          else{
            // let transform = {timestamp: val.timestamp, value: val.value - chart.prev.value }
            let transform = {timestamp: val.timestamp, value: {} }
            Object.each(val.value, function(value, key){
              transform.value[key] = value - chart.prev.value[key]

              if(cumulative_negative && value > 0 && cumulative_negative.test(chart.name+'.'+key)){
                transform.value[key] *= -1
                // debug_internals('transform %o %s %s %o', values, chart.name, chart.path, transform)
              }
            })




            if(transform.timestamp > chart.prev.timestamp)
              transformed.push(transform)

            chart.prev = Object.clone(val)


          }

          if(index == values.length -1)
            cb( transformed )

        }

        // cb( values )
      }
      else if(negative[chart.name]){
        let transformed = []
        for(let index = 0; index < values.length; index++){
          let val = values[index]

          let transform = {timestamp: val.timestamp, value: {} }
          Object.each(val.value, function(value, key){
            transform.value[key] = value

            if(negative[chart.name].indexOf(key) > -1){
              transform.value[key] *= -1
              // debug_internals('transform %o %s %s %o', values, chart.name, chart.path, transform)
            }
          })

          transformed.push(transform)

          if(index == values.length -1)
            cb( transformed )

        }

      }
      else{

        cb( values )
      }


    }
  }
})
