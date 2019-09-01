import { relative } from 'path'

import { src, dest, series, parallel, lastRun } from 'gulp'
import gulpBabel from 'gulp-babel'
import del from 'del'
import mapSources from '@gulp-sourcemaps/map-sources'

import { BUILD_SOURCES, BUILD } from '../../files.js'
import { getWatchTask } from '../../watch.js'

import babelConfig from './.babelrc.js'

const SOURCES_GLOB = `{${BUILD_SOURCES.join(',')}}/**`

// We remove files deeply but leave empty [sub]directories. Otherwise it creates
// issues with `chokidar` (file waching used by `ava --watch` and
// `gulp.watch()`)
// TODO: replace with `promisify(fs.rmdir)(..., {recursive: true})` after
// dropping support for Node <12
const clean = () => del(`${BUILD}/**`, { onlyFiles: true })

const copy = () =>
  src([`${SOURCES_GLOB}/*[^~]`, `!${SOURCES_GLOB}/*.js`], {
    dot: true,
    since: lastRun(copy),
  }).pipe(dest(BUILD))

const babel = () =>
  src(`${SOURCES_GLOB}/*.js`, {
    dot: true,
    since: lastRun(babel),
    sourcemaps: true,
  })
    .pipe(gulpBabel({ ...babelConfig, babelrc: false }))
    .pipe(mapSources(path => `${relative(path, '.')}/${path}`))
    .pipe(dest(BUILD, { sourcemaps: '.' }))

const rebuild = parallel(copy, babel)
export const build = series(clean, rebuild)

// eslint-disable-next-line fp/no-mutation
build.description = 'Build source files'

const buildWatchTask = getWatchTask(BUILD_SOURCES, rebuild)
export const buildw = series(build, buildWatchTask)
