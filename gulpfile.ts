'use strict';

import * as gulp from 'gulp';
import * as sass from 'gulp-sass';
import * as browserify from 'browserify';
import * as source from 'vinyl-source-stream';
import * as express from 'express';
import * as browserSync from 'browser-sync';
import * as gutil from 'gulp-util';
import * as minimist from 'minimist';
import * as minifyCss from 'gulp-minify-css';
const buffer = require('gulp-buffer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
import * as sourcemaps from 'gulp-sourcemaps';

let server: express.Express;
const options: { environment?: string; } = minimist(process.argv);
const environment = options.environment || 'development';

gulp.task('html', () => {
  return gulp.src('src/html/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(reload());
});

gulp.task('images', () => {
  return gulp.src('src/images/**/*.png')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
    .pipe(reload());
});

gulp.task('styles', () => {
  return gulp.src('src/styles/**/*.scss')
    .pipe(environment === 'development' ? sourcemaps.init() : gutil.noop())
      .pipe(sass()).on('error', handleError)
    .pipe(environment === 'development' ? sourcemaps.write() : gutil.noop())
    .pipe(environment === 'production' ? minifyCss() : gutil.noop())
    .pipe(gulp.dest('dist/styles'))
    .pipe(reload());
});

gulp.task('scripts', () => {
  return browserify('./src/scripts/main.js', { debug: environment === 'development' })
    .bundle().on('error', handleError)
    .pipe(source('bundle.js'))
    .pipe(environment === 'production' ? buffer() : gutil.noop())
    .pipe(environment === 'production' ? uglify() : gutil.noop())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(reload());
});

gulp.task('server', () => {
  server = express();
  server.use(express.static('dist'));
  server.listen(8000);
  browserSync({ proxy: 'localhost:8000' });
});

gulp.task('build', ['html', 'styles', 'images', 'scripts']);

gulp.task('watch', () => {
  gulp.watch('src/html/**/*.html', ['html']);
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/images/**/*.png', ['images']);
});

gulp.task('default', ['build', 'watch', 'server']);

function handleError(err: Error) {
  console.log(err.toString());
  this.emit('end');
}

function reload() {
  if (server) {
    return browserSync.reload({ stream: true });
  }

  return gutil.noop();
}
