let DefaultDygraphLine = require('../defaults/dygraph.line')

const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

const formatter = new Intl.NumberFormat('en-US', {
   minimumFractionDigits: 2,
   maximumFractionDigits: 2,
});

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{

  // pre_process: function(chart, name, stat){
  //   return chart
  // },
  watch: {
    // // merge: true,
    // value: undefined,
    // /**
    // * @trasnform: diff between each value against its prev one
    // */
    transform: function(values, vm, chart, cb){
      values = Array.clone(values)
      // let transformed = []
     //
     Array.each(values, function(val, index){
       // let transform = { timestamp: val.timestamp, value: (val.value / 1024) / 1024 }
       // transformed.push(transform)
       // val[1] = Math.round(val[1] / 1024 / 1024)
       val[1] = formatter.format((val[1] * 1) / DAY) * 1

     })

     // ////////console.log('transform: ', transformed)

     // return transformed
     // console.log('memory transform: ', values)
     return values
    }
  },
  "options": {
    digitsAfterDecimal: 2,
    strokeWidth: 1.5,
    labels: ['Time', 'days'],
  }
})
