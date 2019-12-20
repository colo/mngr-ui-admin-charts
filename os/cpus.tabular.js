let DefaultDygraphLine = require('../defaults/dygraph.derived.tabular')

let debug = require('debug')('mngr-ui-admin-charts:os:cpus'),
    debug_internals = require('debug')('mngr-ui-admin-charts:os:cpus:Internals');


module.exports = Object.merge(Object.clone(DefaultDygraphLine),{

  options: {
    stackedGraph: true,
  }

})
