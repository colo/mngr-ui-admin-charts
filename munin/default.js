
let debug = require('debug')('mngr-ui-admin-charts:munin')
let debug_internals = require('debug')('mngr-ui-admin-charts:munin:Internals')


let DefaultDygraphLine = require('../defaults/dygraph.line')

// let allowed_names = /cpu|mem|elapsed|time|count/
let cumulative = /forks|fw_packets|mysql_network_traffic|mysql_select_types|mysql_bytes|mysql_connections|nginx_request/
let negative = /mysql_bytes\.recv|mysql_network_traffic\.Bytesreceived|fw_packets\.received/

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{
  pre_process: function(chart, name, stat){
    debug_internals('pre_process %s %s %s', name, chart.name, chart.path)
    return chart
  },
  // top: {
  //   count: 5,
  //   pids: []
  // },

  // "options": {
  //   // valueRange: [0, 100],
  //   labels: ['Time'],
  // },
  // "options": undefined,
  // match: /^os_procs_stats$/,
  // match: /^[a-zA-Z0-9_]*$/,

  // type: /^os_procs_(.*?)_stats\.top$/,
  prev: {timestamp: 0, value: 0 },

  watch: {

    value: undefined,

    transform: function(values, caller, chart, cb){
      // debug_internals('transform %o %s %s', values, chart.name, chart.path)

      if(cumulative.test(chart.path)){
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
            let transform = {timestamp: val.timestamp, value: val.value - chart.prev.value }
            if(negative && transform.value > 0 && negative.test(chart.path+'.'+chart.name)){
              transform.value *= -1
              // debug_internals('transform %o %s %s %o', values, chart.name, chart.path, transform)
            }



            if(transform.timestamp > chart.prev.timestamp)
              transformed.push(transform)

            chart.prev = Object.clone(val)


          }

          if(index == values.length -1)
            cb( transformed )

        }

        // cb( values )
      }
      else{
        cb( values )
      }

      

    }
  }
})
