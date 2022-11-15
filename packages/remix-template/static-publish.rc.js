/*
 * Copyright Fastly, Inc.
 * Licensed under the MIT license. See LICENSE file for details.
 */

const path = require("path");
const publicDir = path.resolve(process.cwd());

module.exports = {
  publicDir: "./",
  excludeDirs: [ './node_modules', ],
  includeDirs: [ './build', './public' ],
  staticDirs: [ './public/build' ],
  moduleTest: function(path) {
    if (path.endsWith('/remix.config.js') || path.endsWith('/remix.config.mjs')) {
      return true;
    }
    return path.indexOf('/build/') === 0 && !path.endsWith('.map');
  },
  excludeTest: function(path) {
    if (path.startsWith(publicDir + '/remix.config.js') || path.endsWith(publicDir + '/remix.config.mjs')) {
      return false;
    }
    if (path.startsWith(publicDir + '/build/') || path.startsWith(publicDir + '/public/')) {
      return false;
    }
    return true;
  },
  spa: false,
  autoIndex: [],
  autoExt: [],
};
