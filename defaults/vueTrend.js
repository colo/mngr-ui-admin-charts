module.exports = {
  component: 'vue-trend-wrapper',
  "interval": 0,
  "options": {
    min: 0,
    max: 100,
    gradient: ['#99ff99', '#ffff66', '#ff5050'],
    width: 250,
    height: 100,
    // smooth: true,
    // color: "primary",
    // size: "100px",
  },
  // init: function (vue){
  // },
  pre_process: function(chart, name, stat){

    return chart
  },

}
