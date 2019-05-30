import findUp from 'find-up'
import moize from 'moize'

// To run `ava` with the Node inspector, one must do
// `node node_modules/ava/profile.js FILE`
// See https://github.com/avajs/ava/blob/master/docs/recipes/debugging-with-chrome-devtools.md
// `FILE` is required and cannot use `--files` flag.
export const getAvaDebug = async function(args) {
  const inspect = findInspect(args)
  const argsA = args.replace(inspect, '').replace(FILES_REGEXP, '')
  const profile = await mGetAvaProfile()
  return `node ${inspect} ${profile} ${argsA}`
}

const FILES_REGEXP = /--files[=\s]+/gu

const getAvaProfile = function() {
  return findUp('node_modules/ava/profile.js')
}

const mGetAvaProfile = moize(getAvaProfile)

export const isAvaDebug = function(args) {
  return findInspect(args) !== undefined
}

const findInspect = function(args) {
  return args.split(' ').find(isInspect)
}

const isInspect = function(arg) {
  return arg.startsWith('--inspect')
}
