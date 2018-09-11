import * as Highcharts from 'highcharts'

require('highcharts/highcharts-more')(Highcharts)
require('highcharts/modules/solid-gauge')(Highcharts)
// require('highcharts/modules/heatmap')(Highcharts)
// require('highcharts/modules/treemap')(Highcharts)
// require('highcharts/modules/funnel')(Highcharts)

export default {
  component: 'highcharts-vue-wrapper',
  class: undefined,
  // "style": "width:100px; height:100px;",
  "interval": 0,
  watch: {
    // skip: 30,//some charts like frappe need to skip values for render performance (dygraph does this automatically)
  },
  pre_process: function(chart, name, stat){

    return chart
  },
  "options": {

    chart: {
        type: 'solidgauge',
        height: 120,
        // width: 100,
    },

    title: null,

    pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },

    tooltip: {
        enabled: false
    },

    // the value axis
    yAxis: {
        min: 0,
        max: 100,
        title: {
            text: '%'
        },
        stops: [
            [0.1, '#55BF3B'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
            y: -70
        },
        labels: {
            y: 16
        }
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    },



    credits: {
        enabled: false
    },

    series: [{
        // name: 'Speed',
        data: [],
        dataLabels: {
            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                   '<span style="font-size:12px;color:silver">%</span></div>'
        },
        tooltip: {
            // valueSuffix: ' km/h'
        }
    }]
  },


  // init: function (vue){
  // },


}
