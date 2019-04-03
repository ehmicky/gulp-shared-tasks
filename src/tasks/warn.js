'use strict'

const { parallel } = require('gulp')
const { exec } = require('gulp-execa')

const { DEPENDENCIES } = require('../files')
const { getWatchTask } = require('../watch')

const audit = async () => {
  // Older `npm` versions do not have this command
  try {
    await exec('npm audit -h', { stdout: 'ignore' })
  } catch {
    return
  }

  try {
    await exec('npm audit --color=always', { stdout: 'pipe' })
  } catch (error) {
    // Only print `npm audit` output if it failed.
    // eslint-disable-next-line no-console, no-restricted-globals
    console.error(error.stdout)
    throw error
  }
}

const outdated = () => exec('npm outdated')

const warn = parallel(audit, outdated)

// eslint-disable-next-line fp/no-mutation
warn.description = 'Check for outdated/vulnerable dependencies'

const warnw = getWatchTask(DEPENDENCIES, warn)

module.exports = {
  warn,
  warnw,
}
