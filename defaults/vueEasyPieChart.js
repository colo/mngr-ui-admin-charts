module.exports = {
  component: 'vue-easy-pie-chart-wrapper',
  "interval": 0,
  "options": {
    size: 100,
    animate: true,
    // 'track-color': "yellow-3",
    // 'scale-color': 'primary',
    'bar-color': 'blue',
    // 'line-width': 5
  },
  // init: function (vue){
  // },
  pre_process: function(chart, name, stat){

    return chart
  },

}
