let DefaultDygraphLine = require('../defaults/dygraph.line')

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
    transform: function(values, caller, chart){
      // ////////console.log('transform: ', values)
      let transformed = []
      // let prev = {idle: 0, total: 0, timestamp: 0 }
      Array.each(values, function(val, index){

        if(
          chart.prev.timestamp == 0
          || chart.prev.timestamp > val.timestamp
          // || chart.prev.timestamp < val.timestamp - 1999
          // || chart.prev.timestamp > val.timestamp + 1999
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
          let transform = {timestamp: val.timestamp, value: { times: { usage: 0} } }
          let current = {idle: 0, total: 0, timestamp: val.timestamp }
          let prev = Object.clone(chart.prev)

          // if(index == 0){
          Object.each(val.value.times, function(stat, key){
            if(key == 'idle')
              current.idle += stat

              current.total += stat
          })


          let diff_time = current.timestamp - prev.timestamp
          let diff_total = current.total - prev.total;
          let diff_idle = current.idle - prev.idle;

          // ////////console.log('transform: ', current, prev)

          //algorithm -> https://github.com/pcolby/scripts/blob/master/cpu.sh
          let percentage =  (diff_time * (diff_total - diff_idle) / diff_total ) / (diff_time * 0.01)

          if(percentage > 100){
            ////console.log('cpu transform: ', diff_time, diff_total, diff_idle)
          }

          transform.value.times.usage = (percentage > 100) ? 100 : percentage


          // chart.prev = Object.clone(current)

          chart.prev = Object.clone(current)

          // if(index == values.length -1)
          //   chart.prev.timestamp = 0

          transformed.push(transform)
        }


      })

      return transformed

    }
  },


})
