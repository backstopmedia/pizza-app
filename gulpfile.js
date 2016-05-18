'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var express = require('express');
var browserSync = require('browser-sync');
var gutil = require('gulp-util');
var minimist = require('minimist');
var minifyCss = require('gulp-minify-css');
var buffer = require('gulp-buffer');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');

var server;
var options = minimist(process.argv);
var environment = options.environment || 'development';

gulp.task('html', function() {
  return gulp.src('src/html/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(reload());
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*.png')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
    .pipe(reload());
});

gulp.task('styles', function() {
  return gulp.src('src/styles/**/*.scss')
    .pipe(environment === 'development' ? sourcemaps.init() : gutil.noop())
      .pipe(sass()).on('error', handleError)
    .pipe(environment === 'development' ? sourcemaps.write() : gutil.noop())
    .pipe(environment === 'production' ? minifyCss() : gutil.noop())
    .pipe(gulp.dest('dist/styles'))
    .pipe(reload());
});

gulp.task('scripts', function() {
  return browserify('./src/scripts/main.js', { debug: environment === 'development' })
    .bundle().on('error', handleError)
    .pipe(source('bundle.js'))
    .pipe(environment === 'production' ? buffer() : gutil.noop())
    .pipe(environment === 'production' ? uglify() : gutil.noop())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(reload());
});

gulp.task('server', function() {
  server = express();
  server.use(express.static('dist'));
  server.listen(8000);
  browserSync({ proxy: 'localhost:8000' });
});

gulp.task(
  'build',
  gulp.parallel('html', 'styles', 'images', 'scripts')
);

gulp.task('watch', function() {
  gulp.watch('src/html/**/*.html', gulp.series('html'));
  gulp.watch('src/styles/**/*.scss', gulp.series('styles'));
  gulp.watch('src/scripts/**/*.js', gulp.series('scripts'));
  gulp.watch('src/images/**/*.png', gulp.series('images'));
});

gulp.task(
  'default',
  gulp.series('build', gulp.parallel('watch', 'server'))
);

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

function reload() {
  if (server) {
    return browserSync.reload({ stream: true });
  }

  return gutil.noop();
}
