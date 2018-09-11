import DefaultDygraphLine from './default.dygraph.line'

export default Object.merge(Object.clone(DefaultDygraphLine), {
  options: {
    labels: ['Time', 'Out', 'In'],
    // series: {
    //   'Out': {
    //      color: 'red',
    //   },
    //   'In': {
    //      color: 'blue',
    //   }
    //
    // },
  }
})
