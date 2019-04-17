'use strict'

// Meant to be used by caller only, as `presets`.
// Only useful when caller needs to do some Babel compilation outside of
// `gulp build`. This happens for example when using `@babel/register` through
// `gulpfile.babel.js`.
// This cannot be a JSON file because that does not work with `presets`.
module.exports = require('./build/src/tasks/build/.babelrc.js')
