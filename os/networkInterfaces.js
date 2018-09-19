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
  init: function (vm, chart, name, networkInterfaces, type ){
    // console.log('networkInterfaces init: ', vm, chart, name, networkInterfaces, type)
    if(type == 'chart'){
      let splited = name.split('_')
      chart['__messure'] = splited.pop()
      chart['__iface'] = splited.pop()
    }

    // console.log('networkInterfaces init: ', vm, chart, name, networkInterfaces, type)
  },
  prev: {
    timestamp: 0,
    value : {
      recived: 0,
      transmited: 0
    }
  },
  watch: {
    // managed: true,
    // cumulative: true,
    transform: function(values, vm, chart){
      // let watcher = chart.watch || {}
      console.log('networkInterfaces transform: ', values)


      let transformed = []
      let iface = chart.__iface
      let messure = chart.__messure

      Array.each(values, function(val, index){
        /**
        * recived = negative, so it end up ploting under X axis
        **/
        let current = {
          timestamp: val.timestamp,
          value: {
            recived: (val.value[iface]) ? val.value[iface].recived[messure] * -1: 0,
            transmited: (val.value[iface]) ? val.value[iface].transmited[messure] * 1: 0
          }
        }

        // console.log('transform current', current)


        if(
          chart.prev.timestamp == 0
          || chart.prev.timestamp < current.timestamp - 1999
          || chart.prev.timestamp > current.timestamp + 1999
        ){
          chart.prev = Object.clone(current)
        }
        else{
          let transform = {timestamp: val.timestamp, value: { recived: 0, transmited: 0 } }
          let prev = Object.clone(chart.prev)


          transform.value.recived = (prev.value.recived == 0) ? 0 : current.value.recived - prev.value.recived

          transform.value.transmited = (prev.value.transmited == 0) ? 0: current.value.transmited - prev.value.transmited

          if(messure == 'bytes'){ //bps -> Kbps
              transform.value.transmited = transform.value.transmited / 128
              transform.value.recived = transform.value.recived / 128
          }

          if(transform.timestamp > chart.prev.timestamp)
            transformed.push(transform)

          chart.prev = Object.clone(current)

          // if(index == values.length -1)
          //   chart.prev.timestamp = 0
        }

      })
      return transformed


      // // // ////////////////console.log('networkInterfaces', networkInterfaces)
      // //
      // if(networkInterfaces.getLast() !== null){
      //
      //   let val = networkInterfaces.getLast().value
      //   let ifaces = Object.keys(val)
      //   let properties = Object.keys(val[ifaces[0]])
      //   let messures = Object.keys(val[ifaces[0]][properties[1]])//properties[0] is "if", we want recived | transmited
      //
      //   // let chart = Object.clone(DefaultNetDygraphLine)
      //
      //   // Array.each(ifaces, function(iface){
      //
      //     // if(!vm.stats.networkInterfaces+'.'+iface)
      //     //   vm.$set(vm.stats, 'networkInterfaces.'+iface, {})
      //
      //
      //     /**
      //     * turn data property->messure (ex: transmited { bytes: .. }),
      //     * to: messure->property (ex: bytes {transmited:.., recived: ... })
      //     **/
      //     // Array.each(messures, function(messure){// "bytes" | "packets"
      //       // if(!vm.stats[vm.host+'_os.networkInterfaces.'+iface+'.'+messure]){
      //       //
      //       //   vm.add_chart(vm.host+'_os.networkInterfaces.'+iface+'.'+messure, chart)
      //       // }
      //
      //
      //       let data = []
      //       Array.each(networkInterfaces, function(stats, index){
      //         let timestamp =  new Date(stats.timestamp)
      //
      //         let recived = 0
      //         let transmited = 0
      //         let prev_recived = 0
      //         let prev_transmited = 0
      //
      //         if(stats.value[iface] !== undefined){
      //           let current_recived = stats.value[iface]['recived'][messure]
      //           let current_transmited = stats.value[iface]['transmited'][messure]
      //
      //           if(index > 0 && networkInterfaces[index - 1].value[iface]){
      //             prev_recived = networkInterfaces[index - 1].value[iface]['recived'][messure]
      //             prev_transmited = networkInterfaces[index - 1].value[iface]['transmited'][messure]
      //           }
      //
      //           // let prev_recived = (index > 0) ? networkInterfaces[index - 1].value[iface]['recived'][messure] : 0
      //           recived = (prev_recived == 0) ? 0 : 0 - (current_recived - prev_recived)//negative, so it end up ploting under X axis
      //
      //           // let prev_transmited = (index > 0) ? networkInterfaces[index - 1].value[iface]['transmited'][messure] : 0
      //           transmited = (prev_transmited == 0) ? 0: current_transmited - prev_transmited
      //
      //           if(messure == 'bytes'){ //bps -> Kbps
      //               transmited = transmited / 128
      //               recived = recived / 128
      //           }
      //
      //           data.push([timestamp, recived, transmited])
      //         }
      //         else{
      //           data = []
      //           //////////////////console.log('stats.value[iface] undefined', iface)
      //           /**
      //           * should notify error??
      //           **/
      //         }
      //       })
      //
      //       // vm.update_chart_stat(vm.host+'_os.networkInterfaces.'+iface+'.'+messure, data)
      //       return data
      //     // })
      //
      //   // })
      //
      //
      //
      //
      // }
      //
      // // return values
    }

  }

})
