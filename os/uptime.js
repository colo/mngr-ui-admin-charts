import DefaultDygraphLine from './js/default.dygraph.line'

export default Object.merge(Object.clone(DefaultDygraphLine),{

  pre_process: function(chart, name, stat){
    return chart
  },
  "options": {
    labels: ['Time', 'seconds'],
  }
})
