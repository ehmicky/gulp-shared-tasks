import { env } from 'process'

import got from 'got'
import PluginError from 'plugin-error'

import { shouldCover } from './utils.js'

const { GITHUB_REPOSITORY, GITHUB_SHA } = env

// In CI, once each environment has sent their test coverage maps, we check that
// when merging them we are above the minimum threshold
export const checkCoverage = async function () {
  if (!shouldCover()) {
    return
  }

  const covInfo = await getCoverage()

  if (covInfo >= COVERAGE_THRESHOLD) {
    return
  }

  const codecovUrl = getCodecovUrl().replace('/api', '')
  throw new PluginError(
    'gulp-codecov-check',
    `Test coverage is ${covInfo}% but should be at least ${COVERAGE_THRESHOLD}%. See ${codecovUrl}`,
  )
}

const getCoverage = async function () {
  const codecovUrl = getCodecovUrl()
  const {
    commit: { totals },
  } = await got(codecovUrl, {
    timeout: CODECOV_TIMEOUT,
    retry: CODECOV_RETRY,
  }).json()

  // This happens when codecov could not find the commit on GitHub
  if (totals === null) {
    throw new PluginError(
      'gulp-codecov-check',
      `Test coverage is missing. See ${codecovUrl}`,
    )
  }

  const covInfo = Number(totals.c)
  return covInfo
}

// Codecov API fails quite often, we must timeout and retry
const CODECOV_TIMEOUT = 6e4
const CODECOV_RETRY = 10

const getCodecovUrl = function () {
  return `https://codecov.io/api/gh/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}`
}

// TODO: put back to 100. At the moment, Node 12 in CI shows random lines as
// not covered even though they are. This might be a bug with c8 or with Node.js
const COVERAGE_THRESHOLD = 90
