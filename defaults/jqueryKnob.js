module.exports = {
  component: 'jquery-knob-wrapper',
  "interval": 0,
  "options": {
    min : 0, //min value | default=0.
		max : 100, //max value | default=100.
		step : 1, //step size | default=1.
		angleOffset : 0, //starting angle in degrees | default=0.
		angleArc : 360, //arc size in degrees | default=360.
		stopper : true, //stop at min & max on keydown/mousewheel | default=true.
		readOnly : false, //disable input and events | default=false.
		rotation : 'clockwise', //direction of progression | default=clockwise.
		/**
		 * display mode "cursor", cursor size could be changed passing a numeric value to the option, default width is used when passing boolean value "true" | default=gauge.
		 **/
		cursor : 'gauge',
		//thickness : gauge thickness.
		lineCap : 'butt', //gauge stroke endings. | default=butt, round=rounded line endings
		//width : dial width.
		displayInput : true, //default=true | false=hide input.
		displayPrevious : false, //default=false | true=displays the previous value with transparency.
		//fgColor : foreground color.
		//inputColor : input value (number) color.
		//font : font family.
		//fontWeight : font weight.
		//bgColor : background color.
  },
  // init: function (vue){
  // },
  pre_process: function(chart, name, stat){

    return chart
  },

}
