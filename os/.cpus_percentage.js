let DefaultDygraphLine = require('../defaults/dygraph.line')

let debug = require('debug')('mngr-ui-admin-charts:os:cpus_percentage'),
    debug_internals = require('debug')('mngr-ui-admin-charts:os:cpus_percentage:Internals');

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{
  // name: 'os.cpus_simple',
  name: function(vm, chart, stats){
    return vm.host+'_os.cpus_percentage'
  },
  pre_process: function(chart, name, stat){
    return chart
  },
  match: /^cpus/,
  "options": {
    connectSeparatedPoints: true,
    valueRange: [0, 100],
    labels: ['Time', 'usage %'],
    series: {
     'usage %': {
       // color: 'red',
       //strokeWidth: 2,
       // plotter: smoothPlotter,
     },

    },

  },
  /**
  * @var: save prev cpu data, need to calculate current cpu usage
  **/
  prev: {timestamp: 0, value: { times: {} } },
  watch: {
    // cumulative: true,
    // merge: true,
    value: 'times',
    /**
    * @trasnform: diff between each value against its prev one
    */
    transform: function(values, caller, chart, cb){
      // debug_internals('transform %O', values)
      // console.log('transform cpus_percentage: ', values)
      // values.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )

      let transformed = []
      // let prev = {idle: 0, total: 0, timestamp: 0 }
      // Array.each(values, function(val, index){
      for(let index = 0; index < values.length; index++){
        let val = values[index]

        if(
          chart.prev.timestamp == 0
          || chart.prev.timestamp > val.timestamp
          || val.timestamp - chart.prev.timestamp > 1000
          // || chart.prev.timestamp > val.timestamp + 1001
        ){
          // let transform = {timestamp: val.timestamp, value: { times: {} } }

          // //console.log('no prev percentage', chart.prev)
          //console.log('no prev percentage', new Date(chart.prev.timestamp), new Date(val.timestamp), index)

          chart.prev = Object.clone(val)


          // chart.prev.timestamp = val.timestamp
          // Object.each(val.value.times, function(stat, key){
          //   if(key == 'idle'){
          //     chart.prev.value.times[key] = stat - 1
          //   }
          //   else{
          //     chart.prev.value.times[key] = stat
          //   }
          //
          //   // transform.value.times[key] = 0
          // })

          // transformed.push(transform)

          // //console.log('chart.prev.timestamp', chart.prev)

        }
        else{
          debug_internals('transform %O %O', val, chart.prev)

          let transform = {timestamp: val.timestamp, value: { times: { usage: 0} } }
          let current = {idle: 0, total: 0, timestamp: val.timestamp }
          // let prev = {idle: 0, total: 0, timestamp: chart.prev.timestamp }

          // Object.each(chart.prev.value.times, function(stat, key){
          //   if(key == 'idle')
          //     prev.idle += stat
          //
          //     prev.total += stat
          // })

          Object.each(val.value.times, function(time, key){
            let stat = time - chart.prev.value.times[key]
            if(key == 'idle')
              current.idle += stat

              current.total += stat
          })

          // debug_internals('current %O %O', prev, current)
          //
          // let diff_time = current.timestamp - chart.prev.timestamp
          // let diff_total = current.total - prev.total;
          // let diff_idle = current.idle - prev.idle;
          //
          // // ////////console.log('transform: ', current, prev)
          //
          // //algorithm -> https://github.com/pcolby/scripts/blob/master/cpu.sh
          // // let percentage =  (diff_time * (diff_total - diff_idle) / diff_total ) / (diff_time * 0.01)
          let percentage =  ((current.total - current.idle) * 100) / (current.total + 5)
          debug_internals('percentage', percentage)

          // if(percentage > 100){
          //   ////console.log('cpu transform: ', diff_time, diff_total, diff_idle)
          // }

          if(!isNaN(percentage) && percentage >= 0){
            transform.value.times.usage = (percentage > 100) ? 100 : percentage


            // chart.prev = Object.clone(current)
            // if(transform.timestamp > chart.prev.timestamp)
              transformed.push(transform)
          }
          // chart.prev = Object.clone(current)

          chart.prev = Object.clone(val)

          // if(index == values.length -1)
          //   chart.prev.timestamp = 0

          // transformed.push(transform)
        }

        if(index == values.length -1)
          cb( transformed )

      }
      // })

      // return transformed

    }
  },


})
