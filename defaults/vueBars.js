module.exports = {
  component: 'vue-bars-wrapper',
  "interval": 0,
  "options": {
    // padding: 10,
    gradient: ['#6fa8dc', '#42b983'],
    height: 80,
    width: 200,
    // barWidth: 5,
    // growDuration: 1,
    // rounding // specify how round your bars should be
    // barWidth // specify how wide your bars should be


  },
  // init: function (vue){
  // },
  pre_process: function(chart, name, stat){

    return chart
  },

}
