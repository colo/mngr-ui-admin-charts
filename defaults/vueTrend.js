module.exports = {
  component: 'vue-trend-wrapper',
  "interval": 0,
  "options": {
    gradient: ['#99ff99', '#ffff66', '#ff5050'],
    // width: 250,
    // height: 100,
    // min: 0,
    // max: 100,
    // // smooth: true,
    // // color: "primary",
    // // size: "100px",
  },
  // init: function (vue){
  // },

  /**
  * if pre_process not set, it won't run 'init'
  */

  pre_process: function(chart, name, stat){

    return chart
  },

}
