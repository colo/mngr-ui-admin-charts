let DefaultDygraphLine = require('../defaults/dygraph.line')

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{
  // icon: 'memory',
  // name: 'os.freemem',
  // pre_process: function(chart, name, stat){
  //   // console.log('memory pre_process: ', stat)
  //   return chart
  // },
  // name: function(vm, chart, stats){
  //   return vm.host+'_os.freemem'
  // },
  match: /^free/,
  watch: {
    // merge: true,
    value: undefined,
    /**
    * @trasnform: diff between each value against its prev one
    */
    transform: function(values, vm, chart, cb){
      values = Array.clone(values)
      // let transformed = []
     //
     Array.each(values, function(val, index){
       // let transform = { timestamp: val.timestamp, value: (val.value / 1024) / 1024 }
       // transformed.push(transform)
       val[1] = Math.round(val[1] / 1024 / 1024)
       val.pop()
     })

     // ////////console.log('transform: ', transformed)

     // return transformed
     // console.log('memory transform: ', values)
     return values
    }
  },
  init: function (vm, chart, name, stat, type){
    // console.log('memory init: ', vm, chart, name, stat, type)
    stat = Array.clone(stat)
    if(type === 'chart'){
      let totalmem
      if(Array.isArray(stat)){
        // free = stat[0].value[1]
        totalmem = stat[0].value[2]
      }
      else{
        totalmem = stat.value[2]
      }

      chart.options.valueRange = [
        0,
        Math.round(totalmem / 1024 / 1024)
      ]
    }

    // if(
		// 	chart.totalmem
		// 	|| (type == 'chart'
		// 		&& vm.$store.state.hosts
		// 		&& vm.$store.state.stats)
    // ){
    //   let host = vm.$store.state.hosts.current
    //   let totalmem = chart.totalmem || vm.$store.state.stats[host].os.totalmem.value.data
    //   chart.options.valueRange = [
    //     0,
    //     Math.round((totalmem / 1024) / 1024)
    //   ]
    //
    // }
    // if(
		// 	chart.totalmem
    // ){
    //   console.log('init freemem', chart, Math.round((chart.totalmem / 1024) / 1024))
    //
    //   chart.options.valueRange = [
    //     0,
    //     Math.round((chart.totalmem / 1024) / 1024)
    //   ]
    //
    // }
  },
  "options": {
    labels: ['Time', 'Free Mbs'],
    fillGraph: true,
    fillAlpha: 0.5,
    strokeWidth:1,
    valueRange: []
  }
})
