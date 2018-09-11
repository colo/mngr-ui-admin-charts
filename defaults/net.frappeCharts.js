import DefaultFrappeCharts from './default.frappeCharts'

let default_values = []
for(let i =0; i < 12; i++){
  default_values.push(0)
}
export default Object.merge(Object.clone(DefaultFrappeCharts), {
  // type: 'bar',
  options: {
    colors: ['red', 'light-blue'],
    data: {
      datasets: [
        {
          name: "In", chartType: 'line',
          values: Array.clone(default_values)
        },
        {
          name: "Out", chartType: 'line',
          values: Array.clone(default_values)
        },

      ],
    }
  }
})
