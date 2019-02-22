'use strict'

const { parallel } = require('gulp')

const gulpExeca = require('../exec')
const { WARN } = require('../files')
const { getWatchTask } = require('../watch')

const audit = async () => {
  // Older `npm` versions do not have this command
  try {
    await gulpExeca('npm audit -h', { stdout: 'ignore' })
  } catch {
    return
  }

  await gulpExeca('npm audit', { stdout: 'ignore' })
}

const outdated = () => gulpExeca('npm outdated')

const warn = parallel(audit, outdated)

// eslint-disable-next-line fp/no-mutation
warn.description = 'Check for outdated/vulnerable dependencies'

const warnw = getWatchTask(warn, WARN)

module.exports = {
  warn,
  warnw,
}