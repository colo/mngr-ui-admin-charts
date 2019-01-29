let DefaultDygraphLine = require('../defaults/dygraph.line')

let debug = require('debug')('mngr-ui-admin-charts:os.networkInterfaces.stats'),
    debug_internals = require('debug')('mngr-ui-admin-charts:os.networkInterfaces.stats:Internals');


module.exports = Object.merge(Object.clone(DefaultDygraphLine),{

  match: /^os\.networkInterfaces\.stats$/,

  // name: function(vm, chart, stats){
  //   return vm.host+'_os.cpus_times'
  // },
  pre_process: function(chart, name, stat){
    return chart
  },
  options: {
    labels: ['Time', 'recived', 'transmited'],
  },
  // init: function (vm, chart, name, networkInterfaces, type ){
  //   // ////console.log('networkInterfaces init: ', vm, chart, name, networkInterfaces, type)
  //   if(type == 'chart'){
  //     let splited = name.split('_')
  //     chart['__messure'] = splited.pop()
  //     chart['__iface'] = splited.pop()
  //   }
  //
  //   // ////console.log('networkInterfaces init: ', vm, chart, name, networkInterfaces, type)
  // },
  prev: {
    timestamp: 0,
    value : {

    }
  },
  watch: {
    // managed: true,
    // cumulative: true,
    transform: function(values, vm, chart, cb){
      debug_internals('transform', values)
      // let watcher = chart.watch || {}
      // console.log('networkInterfaces stats transform: ', Array.clone(values), Object.clone(chart.prev))


      let transformed = []
      // let iface = chart.__iface
      // let messure = chart.__messure

      // Array.each(values, function(val, index){
      for(let index = 0; index < values.length; index++){
        let val = values[index]

        /**
        * recived = negative, so it end up ploting under X axis
        **/
        let current = {
          timestamp: val.timestamp * 1,
          value: {}
        }

        // Object.each(val.value, function(data, messure){
          // if(!current.value[messure])
          //   current.value[messure] = {}

          current.value.recived = (val.value.recived) ? val.value.recived * -1 : 0
          current.value.transmited = (val.value.transmited) ? val.value.transmited * 1: 0


        // })


        // console.log('transform current', current)


        if(
          chart.prev.timestamp == 0
          || chart.prev.timestamp > current.timestamp
          // || chart.prev.timestamp < current.timestamp - 1999
          // || chart.prev.timestamp > current.timestamp + 1001
        ){
          chart.prev = Object.clone(current)
        }
        else{
          let transform = {timestamp: current.timestamp * 1, value: { } }
          let prev = Object.clone(chart.prev)

          // Object.each(current.value, function(data, messure){
            // if(!transform.value[messure])
            //   transform.value[messure] = {recived: 0, transmited: 0}

            // transform.value[messure].recived = (prev.value[messure].recived == 0) ? 0 : current.value[messure].recived - prev.value[messure].recived
            // transform.value[messure].transmited = (prev.value[messure].transmited == 0) ? 0 : current.value[messure].transmited - prev.value[messure].transmited
            transform.value.recived = (prev.value.recived == 0) ? 0 : current.value.recived - prev.value.recived
            transform.value.transmited = (prev.value.transmited == 0) ? 0 : current.value.transmited - prev.value.transmited

          // })

          //
          // if(messure == 'bytes'){ //bps -> Kbps
          //     transform.value.transmited = transform.value.transmited / 128
          //     transform.value.recived = transform.value.recived / 128
          // }

          // console.log('networkInterfaces stats transform: ',transform.timestamp, prev,  transformed)

          if(transform.timestamp > chart.prev.timestamp)
            transformed.push(transform)

          chart.prev = Object.clone(current)

          // if(index == values.length -1)
          //   chart.prev.timestamp = 0

        }

        if(index == values.length -1){
          cb( transformed )
        }

      }

      // cb( transformed )
      // })
      // return transformed



    }

  }

})
