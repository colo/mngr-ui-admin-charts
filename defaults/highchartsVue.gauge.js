

// Highcharts.createElement('link', {
//     href: 'https://fonts.googleapis.com/css?family=Dosis:400,600',
//     rel: 'stylesheet',
//     type: 'text/css'
// }, null, document.getElementsByTagName('head')[0]);
//
// Highcharts.theme = {
//     colors: ['#7cb5ec', '#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066',
//         '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
//     chart: {
//         backgroundColor: null,
//         style: {
//             fontFamily: 'Dosis, sans-serif'
//         }
//     },
//     title: {
//         style: {
//             fontSize: '16px',
//             fontWeight: 'bold',
//             textTransform: 'uppercase'
//         }
//     },
//     tooltip: {
//         borderWidth: 0,
//         backgroundColor: 'rgba(219,219,216,0.8)',
//         shadow: false
//     },
//     legend: {
//         itemStyle: {
//             fontWeight: 'bold',
//             fontSize: '13px'
//         }
//     },
//     xAxis: {
//         gridLineWidth: 1,
//         labels: {
//             style: {
//                 fontSize: '12px'
//             }
//         }
//     },
//     yAxis: {
//         minorTickInterval: 'auto',
//         title: {
//             style: {
//                 textTransform: 'uppercase'
//             }
//         },
//         labels: {
//             style: {
//                 fontSize: '12px'
//             }
//         }
//     },
//     plotOptions: {
//         candlestick: {
//             lineColor: '#404048'
//         }
//     },
//
//
//     // General
//     background2: '#F0F0EA'
//
// };
// require('highcharts/modules/heatmap')(Highcharts)
// require('highcharts/modules/treemap')(Highcharts)
// require('highcharts/modules/funnel')(Highcharts)

module.exports = function(Highcharts){
	require('highcharts/highcharts-more')(Highcharts)
	require('highcharts/modules/solid-gauge')(Highcharts)
	require('highcharts/js/themes/grid-light')(Highcharts)
	require('highcharts/css/highcharts.css')
	require('highcharts/css/themes/grid-light.css')



	return {
		component: 'highcharts-vue-wrapper',
		class: undefined,
		// "style": "width: 300px; height: 200px; float: left",
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
				height: 200,
				width: 320,
				borderWidth: -1,
				plotBorderWidth: -1,
				plotBorderColor: 'none',
				shadow: undefined,
				backgroundColor: 'none',
				plotBackgroundColor: 'none',
				borderColor: 'none'
			},

			title: null,

			pane: {
					center: ['50%', '85%'],
					size: '140%',
					startAngle: -90,
					endAngle: 90,
					background: {
							borderWidth: -1,
							borderColor: '#FFFFFF',
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

}
