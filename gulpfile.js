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

var server;
var options = minimist(process.argv);
var environment = options.environment || 'development';

gulp.task('html', function() {
  return gulp.src('src/html/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(reload());
});

gulp.task('styles', function() {
  return gulp.src('src/styles/**/*.scss')
    .pipe(sass({
      sourceComments: environment === 'development' ? 'map' : false
    })).on('error', handleError)
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

gulp.task('build', ['html', 'styles', 'scripts']);

gulp.task('watch', function() {
  gulp.watch('src/html/**/*.html', ['html']);
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
});

gulp.task('default', ['build', 'watch', 'server']);

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
