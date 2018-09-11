let DefaultDygraphLine = require('../defaults/dygraph.line')

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{
  match: /^blockdevices\..*/,
  // labeling: function(vm, chart, name, stat){
  //   // //console.log('blkdev_stats', chart, name, stat)
  //
  //   return vm.host+'_os.'+name
  // },
  /**
  * @var: save prev cpu data, need to calculate current cpu usage
  **/
  prev: {timestamp: 0, value: { stats: {} } },
  watch: {
    // cumulative: true,
    value: 'stats',
    /**
    * @trasnform: diff between each value against its prev one
    */
    transform: function(values, caller, chart){
      // console.log('blockdevices transform: ', values)

      let transformed = []
      let prev = null
      Array.each(values, function(val, index){


        if(
          chart.prev.timestamp == 0
          || chart.prev.timestamp > val.timestamp
          // || chart.prev.timestamp < val.timestamp - 1999
          // || chart.prev.timestamp > val.timestamp + 1999
        ){
          console.log('no prev blockdevice', new Date(chart.prev.timestamp), new Date(val.timestamp), index)

          chart.prev = Object.clone(val)
        }
        else{

          let transform = {timestamp: val.timestamp, value: { stats: {} } }
          let prev = Object.clone(chart.prev)

          // if(index == 0){
          //   Object.each(val.value.stats, function(stat, key){
          //       transform.value.stats[key] = 0
          //   })
          // }
          // else{
            Object.each(val.value.stats, function(stat, key){
              let value = ((stat - prev.value.stats[key]) > 0) ? stat - prev.value.stats[key] : 0
              transform.value.stats[key] = value
            })
          // }

          chart.prev = Object.clone(val)

          // if(index == values.length -1)
          //   chart.prev.timestamp = 0

          transformed.push(transform)

        }


      })
      console.log('blockdevices transform: ', transformed)
      return transformed
    }
  }

})
