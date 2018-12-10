let DefaultDygraphLine = require('../defaults/dygraph.line')

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{

  pre_process: function(chart, name, stat){
    // console.log('procs_top pre_process', name, stat)
    // let count = 1
    // while(count <= chart.top){
    //   chart.options.labels.push(count)
    // }
    //let count = 1
    //while(count <= chart.top){
      //chart.options.labels.push('top '+count)
      //count++
    //}
    return chart
  },
  "options": {
    labels: ['Time'],
  },
  match: /^[a-zA-Z0-9_]*$/,
  /**
  * @var: save prev cpu data, need to calculate current cpu usage
  **/
  //prev: {timestamp: 0, value: { times: {} } },
  top: 5,
  watch: {
    // merge: true,
    // cumulative: true,
    value: undefined,
    // filters: [{
    //   type: /ext.*/
    // }],
    /**
    * @trasnform: diff between each value against its prev one
    */
    transform: function(values, caller, chart, cb){

      // values.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} )

			// console.log('procs_top transform: ', values)

      let transformed = []

      for(let index = 0; index < values.length; index++){
        let pre_transformed = []
        let val = values[index]
        // transformed.push({timestamp: val.timestamp, value: Object.keys(val.value).length})
        Object.each(val.value, function(data, uid){
          // console.log('pre transformed: ', data)
          pre_transformed.push({count: data.count, uid: uid})

        })
        pre_transformed.sort(function(a,b) {return (a.count > b.count) ? 1 : ((b.count > a.count) ? -1 : 0);} )
        let length = pre_transformed.length
        pre_transformed.splice(
          (chart.top * -1) -1,
          length - chart.top
        )

        pre_transformed.reverse()
        let count = 0
        let value = []
        while(count < pre_transformed.length){
          value.push(pre_transformed[count].count)
          chart.options.labels[count + 1] = 'uid['+pre_transformed[count].uid+']'
          // transformed.push({timestamp: val.timestamp, value: pre_transformed[i]})
          count++
        }
        transformed.push({timestamp: val.timestamp, value: value})
        // console.log('pre transformed: ', pre_transformed)

        // console.log('pre transformed: ', Object.keys(val.value).length)
        // pre_transformed.push({count: Object.keys(val.value).length, uid: })
        if(index == values.length -1){

          // pre_transformed.sort(function(a,b) {return (a.count > b.count) ? 1 : ((b.count > a.count) ? -1 : 0);} )
          // console.log('transformed: ', transformed)
          cb( transformed )
        }
      }

      //console.log('transformed: ', transformed)

    }
  }

})
