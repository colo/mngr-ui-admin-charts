import DefaultDygraphLine from './js/default.dygraph.line'

export default Object.merge(Object.clone(DefaultDygraphLine),{
  // icon: 'memory',
  // name: 'os.freemem',
  pre_process: function(chart, name, stat){
    return chart
  },
  name: function(vm, chart, stats){
    return vm.host+'_os.freemem'
  },
  match: /^freemem/,
  watch: {
    // merge: true,
    value: undefined,
    /**
    * @trasnform: diff between each value against its prev one
    */
    transform: function(values){
      // //////console.log('transform: ', values)
      let transformed = []

      Array.each(values, function(val, index){
        let transform = { timestamp: val.timestamp, value: (val.value / 1024) / 1024 }
        transformed.push(transform)
      })

      // //////console.log('transform: ', transformed)

      return transformed
    }
  },
  init: function (vm, chart, name, stat, type){
    // console.log('init freemem', type, vm, vm.$store.state.hosts.current, vm.$store.state.stats)
    if(type == 'chart'
      && vm.$store.state.hosts
      && vm.$store.state.stats
    ){
      let host = vm.$store.state.hosts.current
      chart.options.valueRange = [
        0,
        Math.round((vm.$store.state.stats[host].os.totalmem.value.data / 1024) / 1024)
      ]

    }

  },
  "options": {
    labels: ['Time', 'Mbytes'],
  }
})
