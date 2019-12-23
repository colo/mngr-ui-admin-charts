let DefaultDygraphLine = require('../defaults/dygraph.derived.tabular')

let debug = require('debug')('mngr-ui-admin-charts:os:blockdevices.sectors'),
    debug_internals = require('debug')('mngr-ui-admin-charts:os:blockdevices.sectors:Internals');

module.exports = Object.merge(Object.clone(DefaultDygraphLine),{
  config: {
    // recived:
    read_ios: {
      negative: "write_ios"
    },
    read_merges: {
      negative: "write_merges"
    },
    // drop_transmited: {
    //   negative: "drop_recived"
    // }
  }


})
