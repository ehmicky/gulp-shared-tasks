import { relative } from 'path'

import mapSources from '@gulp-sourcemaps/map-sources'
import del from 'del'
import gulp from 'gulp'
import gulpBabel from 'gulp-babel'

import { BUILD_SOURCES, BUILD } from '../../files.js'
import { getWatchTask } from '../../watch.js'

import babelConfig from './.babelrc.js'

const SOURCES_GLOB = `{${BUILD_SOURCES.join(',')}}/**`

// We remove files deeply but leave empty [sub]directories. Otherwise it creates
// issues with `chokidar` (file waching used by `ava --watch` and
// `gulp.watch()`)
// TODO: replace with `fs.promises.rm(..., {recursive: true})` after
// dropping support for Node <14.14.0
const clean = () => del(`${BUILD}/**`, { onlyFiles: true })

const copy = () =>
  gulp
    .src([`${SOURCES_GLOB}/*[^~]`, `!${SOURCES_GLOB}/*.js`], {
      dot: true,
      since: gulp.lastRun(copy),
    })
    .pipe(gulp.dest(BUILD))

const babel = () =>
  gulp
    .src(`${SOURCES_GLOB}/*.js`, {
      dot: true,
      since: gulp.lastRun(babel),
      sourcemaps: true,
    })
    .pipe(gulpBabel({ ...babelConfig, babelrc: false }))
    .pipe(mapSources((path) => `${relative(path, '.')}/${path}`))
    .pipe(gulp.dest(BUILD, { sourcemaps: '.' }))

const rebuild = gulp.parallel(copy, babel)
export const build = gulp.series(clean, rebuild)

// eslint-disable-next-line fp/no-mutation
build.description = 'Build source files'

const buildWatchTask = getWatchTask(BUILD_SOURCES, rebuild)
export const buildw = gulp.series(build, buildWatchTask)
