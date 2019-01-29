let DefaultDygraphLine = require('../defaults/dygraph.line')

let debug = require('debug')('mngr-ui-admin-charts:os:cpus_times'),
    debug_internals = require('debug')('mngr-ui-admin-charts:os:cpus_times:Internals');


module.exports = Object.merge(Object.clone(DefaultDygraphLine),{
  // name: 'os.cpus_times',
  // name: function(vm, chart, stats){
  //   return vm.host+'_os_cpus_times'
  // },

  // match: /^cpus/,
  // pre_process: function(chart, name, stat){
  //   // debug_internals('chart, name, stat', chart, name, stat[0].value)
  //
  //   return chart
  // },

  /**
  * @var: save prev cpu data, need to calculate current cpu usage
  **/
  prev: {timestamp: 0, value: { times: {} } },
  watch: {
    merge: true,
    // cumulative: true,
    value: 'times',
    /**
    * @trasnform: diff between each value against its prev one
    */
    transform: function(values, caller, chart, cb){
      // values.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )

      // values.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )

      // console.log('cpus_times transform: ', values)

      let transformed = []
      // let prev = null

      // // Array.each(values, function(val, index){
      // let not_all_zeros = false
      // Object.each(chart.prev.value.times, function(value, prop){
      //   if(value != 0)
      //     not_all_zeros = true
      // })

      for(let index = 0; index < values.length; index++){
        let val = values[index]

        if(
          chart.prev.timestamp == 0
          || chart.prev.timestamp > val.timestamp
        ){
        // if(
        //   not_all_zeros == false
        //   // || (values.length > 1 && index == 0)//first item of range data
        //   || chart.prev.timestamp == 0
        //   || chart.prev.timestamp > val.timestamp
        //   || chart.prev.timestamp < val.timestamp - 1999//is time diff is almost 2 secs
        //   // || chart.prev.timestamp > val.timestamp + 999
        // ){
          // let transform = {timestamp: val.timestamp, value: { times: {} } }
          //console.log('no prev times', new Date(chart.prev.timestamp), new Date(val.timestamp), index)

          chart.prev = Object.clone(val)

          // chart.prev.timestamp = val.timestamp
          // chart.prev.value.times = Object.clone(val.value.times)

          // Object.each(val.value.times, function(stat, key){
          //   if(key == 'idle'){
          //     chart.prev.value.times[key] = stat * -1
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
        else {
          debug_internals('transform', val)

          let transform = {timestamp: val.timestamp, value: { times: {} } }
          let prev = Object.clone(chart.prev)

          // let not_all_zeros = false
          // Object.each(prev.value.times, function(value, prop){
          //   if(value != 0)
          //     not_all_zeros = true
          // })

          // if(
          //   not_all_zeros == true
          //   && val.timestamp < prev.timestamp + 1100//not more than 1.1 second difference
          // ){

          //not more than 1.1 second difference
          if(val.timestamp > prev.timestamp && val.timestamp < prev.timestamp + 1100){
            Object.each(val.value.times, function(stat, key){

              // if(key == 'idle'){//represent idle on the negative sideof axes
              //   // stat = stat * -1
              //   let value = ((stat - prev.value.times[key]) < 0) ? stat - prev.value.times[key] : 0
              //   transform.value.times[key] = value
              // }
              // else{
                if(stat >= prev.value.times[key]){
                  let value = ((stat - prev.value.times[key]) > 0) ? stat - prev.value.times[key] : 0
                  transform.value.times[key] = value * 1
                }
                else{
                  transform.value.times[key] = 0
                }
                // if(key == 'idle' && transform.value.times[key] != 0)//represent idle on the negative sideof axes
                //   transform.value.times[key] *= -1

              // }
            })

              // let transform_not_all_zeros = false
              // Object.each(transform.value.times, function(value, prop){
              //   if(value > 0)
              //     transform_not_all_zeros = true
              // })


              transform.value.times['idle'] *= -1


              if(transform.timestamp > prev.timestamp){
              // if(transform.timestamp > prev.timestamp && transform_not_all_zeros == true){
                // console.log('cpus times',  prev.timestamp, val.timestamp, prev.value.times, val.value.times)
                transformed.push(transform)
              }

              // val.value.times.idle = val.value.times.idle * -1
          }

          // let all_bigger = true
          // Object.each(val.value.times, function(value, prop){
          //   if(value < prev.value.times[prop])
          //     all_bigger = false
          // })
          //
          // if(all_bigger == true)
            chart.prev = Object.clone(val)

          // if(index == values.length -1)
          //   chart.prev.timestamp = 0
        }

        if(index == values.length -1)
          cb( transformed )
      }
      // })

      //console.log('transformed: ', transformed)

    }
  }

})
