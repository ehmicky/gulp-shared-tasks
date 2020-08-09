import { task } from 'gulp-execa'

import { DIRS } from '../../files.js'

const JSCPD_CONFIG = `${__dirname}/.jscpd.json`

// Must always run on all files even in watch mode, since code duplication
// is cross-files.
// jscpd does not support globbing:
//   https://github.com/kucherenko/jscpd/issues/388
// so we need to use `DIRS` pattern instead of `JAVASCRIPT`.
// We cannot expand globbing patterns ourselves because it can hit the CLI
// max length.
export const jscpd = task(`jscpd --config=${JSCPD_CONFIG} ${DIRS.join(' ')}`, {
  echo: false,
})
