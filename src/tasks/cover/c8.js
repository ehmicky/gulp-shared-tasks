import { shouldCover } from './utils.js'

// Wrap with `c8` if in CI
// Locally, one must directly call `c8 ava`
export const getC8 = function () {
  return shouldCover()
    ? `c8 --exclude=build/test --exclude=ava.config.cjs --reporter=lcov --reporter=text --reporter=html --reporter=json `
    : ''
}
