let DefaultDygraphLine = require('../defaults/dygraph.derived.tabular')

let debug = require('debug')('mngr-ui-admin-charts:os:blockdevices.sectors'),
    debug_internals = require('debug')('mngr-ui-admin-charts:os:blockdevices.sectors:Internals');

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{
  config: {
    // recived:
    read_sectors: {
      negative: "write_sectors"
    },
    // time_in_queue: {
    //   negative: "errs_recived"
    // },
    // drop_transmited: {
    //   negative: "drop_recived"
    // }
  }


})
