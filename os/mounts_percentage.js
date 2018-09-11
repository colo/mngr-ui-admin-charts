import DefaultDygraphLine from './js/default.dygraph.line'

export default Object.merge(Object.clone(DefaultDygraphLine),{
  // name: 'mounts_percentage',
  pre_process: function(chart, name, stat){
    return chart
  },
  match: /^mounts/,
  // label: 'somelabel',
  labeling: function(vm, chart, name, stat){

    return vm.host+'_os.mounts['+stat[0].value.mount_point+']'
  },
  watch: {
    // merge: true,
    filters: [{
      type: /ext.*/
    }],
    // exclude: /samples/,
    value: 'percentage',

  },
  // init: function (vm, chart, type){
  //   if(type == 'chart'
  //     && vm.$store.state.hosts[vm.host]
  //     && vm.$store.state.hosts[vm.host].os
  //     && vm.$store.state.hosts[vm.host].os.mounts
  //   ){
  //     if(vm.$store.state.hosts[vm.host])
  //     chart.options.valueRange = [0, Math.round((vm.$store.state.hosts[vm.host].os.totalmem[0].value / 1024) / 1024) ]
  //     //////console.log('valueRange', chart)
  //   }
  //
  // },
  "options": {
    valueRange: [0, 100],
    labels: ['Time', 'usage %'],
    series: {
     'usage %': {
       // color: 'red',
       //strokeWidth: 2,
       // plotter: smoothPlotter,
     },

    },
  }
})
