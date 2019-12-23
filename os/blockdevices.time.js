let DefaultDygraphLine = require('../defaults/dygraph.derived.tabular')

let debug = require('debug')('mngr-ui-admin-charts:os:blockdevices.time'),
    debug_internals = require('debug')('mngr-ui-admin-charts:os:blockdevices.time:Internals');

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{
  config: {
    // recived:
    read_ticks: {
      negative: "write_ticks"
    },
    // time_in_queue: {
    //   negative: "errs_recived"
    // },
    // drop_transmited: {
    //   negative: "drop_recived"
    // }
  }


})
