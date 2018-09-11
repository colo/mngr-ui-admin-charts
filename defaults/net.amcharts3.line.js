import DefaultAMCharts3Line from './default.amcharts3.line'

module.exports = Object.merge(Object.clone(DefaultAMCharts3Line), {
  axis:['timestamp', 'transmited', 'recived'],
  watch: {
    skip: 60,//some charts like frappe need to skip values for render performance (dygraph does this automatically)
  },
  "options": {
    "dataProvider": [{
        "timestamp": 0,
        "transmited": 0,
        "recived": 0
    }],
    // "valueAxes": [
    //   {
    //     "id": "transmited",
    //     "axisAlpha": 0.2,
    //     "dashLength": 1,
    //     "position": "left"
    //   },
    //   {
    //     "id": "recived",
    //     "axisAlpha": 0.2,
    //     "dashLength": 1,
    //     "position": "right",
    //     "reversed": true,
    //     // "offset": -200
    //   }
    // ],
    "valueAxes": [{
        "axisAlpha": 0.2,
        "dashLength": 1,
        "position": "left"
    }],
    "mouseWheelZoomEnabled": true,
    "graphs": [
      {
        "id": "transmited",
        "valueAxis": "transmited",
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "hideBulletsCount": 50,
        "title": "Transmited",
        "valueField": "transmited",
        "useLineColorForBulletBorder": true,
        "balloon":{
            "drop":true
        },
        "fillAlphas": 0.2,
        "lineThickness": 2,
        "lineColor": "#3366ff",

      },
      {
        "id": "recived",
        "valueAxis": "recived",
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "hideBulletsCount": 50,
        "title": "Recived",
        "valueField": "recived",
        "useLineColorForBulletBorder": true,
        "balloon":{
            "drop":true
        },
        "fillAlphas": 0.2,
        "lineThickness": 2,
        "lineColor": "#ff5050",
      },
    ],
    // "chartScrollbar": {
    //     "autoGridCount": true,
    //     "graph": "transmited",
    //     "scrollbarHeight": 40
    // },
    // "chartCursor": {
    //    "limitToGraph":"transmited"
    // },
    "categoryField": "timestamp",
    "categoryAxis": {
        "parseDates": true,
        "minPeriod": "ss",//seconds
        // "dateFormats": [{period:'ss',format:'JJ:NN:SS'}],
        "axisColor": "#DADADA",
        "dashLength": 1,
        "minorGridEnabled": true
    },
    // "export": {
    //     "enabled": true
    // }
  }
})
