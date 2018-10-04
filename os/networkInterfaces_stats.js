let DefaultDygraphLine = require('../defaults/dygraph.line')

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{
  match: /^networkInterfaces/,

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
    transform: function(values, vm, chart){
      // let watcher = chart.watch || {}
      // console.log('networkInterfaces stats transform: ', values[0].value.errs)


      let transformed = []
      // let iface = chart.__iface
      // let messure = chart.__messure

      Array.each(values, function(val, index){
        /**
        * recived = negative, so it end up ploting under X axis
        **/
        let current = {
          timestamp: val.timestamp,
          value: {}
        }

        Object.each(val.value, function(data, messure){
          if(!current.value[messure])
            current.value[messure] = {}


          current.value[messure].recived = (val.value[messure].recived) ? val.value[messure].recived * -1 : 0


          current.value[messure].transmited = (val.value[messure].transmited) ? val.value[messure].transmited * 1: 0


        })


        // console.log('transform current', current)


        if(
          chart.prev.timestamp == 0
          || chart.prev.timestamp < current.timestamp - 1999
          || chart.prev.timestamp > current.timestamp + 1999
        ){
          chart.prev = Object.clone(current)
        }
        else{
          let transform = {timestamp: val.timestamp, value: { } }
          let prev = Object.clone(chart.prev)

          Object.each(current.value, function(data, messure){
            if(!transform.value[messure])
              transform.value[messure] = {recived: 0, transmited: 0}

            transform.value[messure].recived = (prev.value[messure].recived == 0) ? 0 : current.value[messure].recived - prev.value[messure].recived
            transform.value[messure].transmited = (prev.value[messure].transmited == 0) ? 0 : current.value[messure].transmited - prev.value[messure].transmited

          })

          //
          // if(messure == 'bytes'){ //bps -> Kbps
          //     transform.value.transmited = transform.value.transmited / 128
          //     transform.value.recived = transform.value.recived / 128
          // }

          if(transform.timestamp > chart.prev.timestamp)
            transformed.push(transform)

          chart.prev = Object.clone(current)

          // if(index == values.length -1)
          //   chart.prev.timestamp = 0
        }

      })
      return transformed



    }

  }

})
